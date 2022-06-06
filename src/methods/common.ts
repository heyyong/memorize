import { Word } from "@/methods/memorize/Word";
import { AppDataSource } from "@/data-source"
import { Example, Meaning, Pronunciation, Property, Voc } from "@/entity/voc"
import { Meaning as APIMeaning } from '@/methods/memorize/Meaning';
import { Example as APIExample } from '@/methods/memorize/Example';
import { In } from "typeorm"
import pino from '@/logger';

const logger = pino.child({ module: 'common' });

export async function composeWords(mVocs: Voc[]): Promise<Word[]> {
    const spellings = mVocs.map(v => v.voc)
    const pronReg = AppDataSource.getRepository(Pronunciation);
    const prons = (await pronReg.findBy({
        voc: In(spellings),
    })).reduce<Record<string, Pronunciation>>((prons, p) => {
        prons[p.voc] = p;

        return prons;
    }, {});

    const propReg = AppDataSource.getRepository(Property);
    const props = (await propReg.findBy({
        voc: In(spellings),
    })).reduce<Record<string, Property[]>>((props, p) => {
        if (!(p.voc in props)) {
            props[p.voc] = [];
        }

        props[p.voc].push(p);

        return props;
    }, {})

    const meanReg = AppDataSource.getRepository(Meaning);
    const means = (await meanReg.findBy({
        voc: In(spellings),
    })).reduce<Record<number, Meaning[]>>((means, m) => {
        if (!means[m.propId])
            means[m.propId] = [];

        means[m.propId].push(m);

        return means;
    }, {});

    const exReg = AppDataSource.getRepository(Example);
    const exs = (await exReg.findBy({
        voc: In(spellings),
    })).reduce<Record<number, Example[]>>((exs, e) => {
        if (!exs[e.meanId])
            exs[e.meanId] = [];

        exs[e.meanId].push(e);
        return exs;
    }, {});
    logger.info(`[composeWords] mVocs=${mVocs.length}`)

    const words: Word[] = [];
    for (const voc of mVocs) {
        const mPron = prons[voc.voc];
        if (!mPron) throw new Error(`Lack of pronunciation ${voc.voc}`);

        const w: Word = {
            id: voc.id,
            voc: voc.voc,
            cla: voc.cla,
            pron: {
                id: mPron.id,
                audio: mPron.audio,
                phonetic: mPron.phonetic,
            },
            properties: [],
        };
        words.push(w);
        logger.info(`[composeWords] words=${words[0]}`)

        for (const p of props[voc.voc] || []) {
            const property = {
                id: p.id,
                prop: p.prop,
                meanings: [],
            };
            w.properties.push(property);

            for (const m of means[p.id] || []) {
                const meaning: APIMeaning = {
                    id: m.id,
                    content: m.content,
                    examples: [],
                };

                property.meanings.push(meaning);

                for (const e of exs[m.id] || []) {
                    const example: APIExample = {
                        id: e.id,
                        example: e.example,
                    };

                    meaning.examples.push(example);
                }
            }
        }
    }
    logger.info(`[composeWords] words=${words.length}`)
    return words;
}
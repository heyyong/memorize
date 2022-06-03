import { AppDataSource } from "@/data-source"
import { Example, Meaning, Pronunciation, Property, Voc } from "@/entity/voc"
import { Property as APIProperty } from '@/methods/memorize/Property';
import { GetWordListRequest } from "@/methods/memorize/GetWordListRequest"
import { GetWordListResponse } from "@/methods/memorize/GetWordListResponse"
import { MemorizeServiceHandlers } from "@/methods/memorize/MemorizeService"
import { Word } from "@/methods/memorize/Word"
import { Meaning as APIMeaning } from '@/methods/memorize/Meaning';
import { Example as APIExample } from '@/methods/memorize/Example';
import { In } from "typeorm"
import pino from '@/logger';

const logger = pino.child({ module: 'getWordList' });

export const getWordList: MemorizeServiceHandlers['GetWordList'] = (call, callback) => {
    getWords(call.request).then(resp => callback(null, resp)).catch(err => {
        logger.error(err);
        callback(err, null);
    });
}

async function getWords(r: GetWordListRequest): Promise<GetWordListResponse> {
    const vocReg = AppDataSource.getRepository(Voc);

    const count = await vocReg.count();
    const [mVocs, mCount] = await vocReg.findAndCount({
        skip: r.offset,
        take: r.pageSize,
    });

    const spells = mVocs.map(v => v.voc);

    const pronReg = AppDataSource.getRepository(Pronunciation);
    const prons = (await pronReg.findBy({
        voc: In(spells),
    })).reduce<Record<string, Pronunciation>>((prons, p) => {
        prons[p.voc] = p;

        return prons;
    }, {});

    const propReg = AppDataSource.getRepository(Property);
    const props = (await propReg.findBy({
        voc: In(spells),
    })).reduce<Record<string, Property[]>>((props, p) => {
        if (!(p.voc in props)) {
            props[p.voc] = [];
        }

        props[p.voc].push(p);

        return props;
    }, {})

    const meanReg = AppDataSource.getRepository(Meaning);
    const means = (await meanReg.findBy({
        voc: In(spells),
    })).reduce<Record<number, Meaning[]>>((means, m) => {
        if (!means[m.propId])
            means[m.propId] = [];

        means[m.propId].push(m);

        return means;
    }, {});

    const exReg = AppDataSource.getRepository(Example);
    const exs = (await exReg.findBy({
        voc: In(spells),
    })).reduce<Record<number, Example[]>>((exs, e) => {
        if (!exs[e.meanId])
            exs[e.meanId] = [];

        exs[e.meanId].push(e);
        return exs;
    }, {});

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

    return {
        wordList: words,
        count: words.length,
        offset: r.offset,
        total: count,
    };
}
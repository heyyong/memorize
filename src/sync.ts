import { DataSource } from 'typeorm';

import { getVoc } from './vocabularies';
import pino from './logger';
import { getWord, HeadwordEntry, RetrieveEntry, PronunciationsList } from './api/words';
import { Voc, Property, Pronunciation, Meaning, Example } from './entity/voc';

const logger = pino.child({ module: 'sync' });

export async function syncWordToDB(db: DataSource) {
    try {
        logger.info(`[syncWordToDB] start sync...`)
        const words = await getVoc()

        await Promise.all(words.map(async (word, index) => {
            logger.info(`[syncWordToDB]start to sync ${index}:${word.voc}`);
            const res = await getWord('en-us', word.voc);

            await sync(db, word.cla, word.voc, res.results)

            logger.info(`[syncWordToDB]finish ${index + 1}/${words.length}`);
        }));
        logger.info(`[syncWordToDB] finish sync! exit!`);
    } catch (err) {
        logger.error('[syncWordToDB] occur error!')
        console.error(`[syncWordToDB] ${err.message}`);
        throw err;
    }
}

async function sync(db: DataSource, cla: string, spell: string, headwordEntries: HeadwordEntry[]): Promise<void> {
    logger.info(`[sync]{${spell}}:async start`)
    const vocReg = db.getRepository(Voc);

    let count = await vocReg.count({ where: { voc: spell } });

    logger.info(`[${spell}]:voc check`)
    if (count > 1) throw new Error('dirty data of word: ' + spell);
    if (count === 0) {
        const voc = new Voc();
        voc.voc = spell;
        voc.cla = cla;
        await vocReg.save(voc);
        logger.info(`[sync]{${spell}}:voc save success`)
    }
    logger.info(`[sync]{${spell}}:voc check finished`)

    let headwordEntry = headwordEntries.find(({ word }) => word === spell);
    if (!headwordEntries) throw new Error('can not find word ' + spell)

    // save pronunciation
    logger.info(`[sync]{${spell}}:pronunciation check`)
    {
        let pronunciations: PronunciationsList = [];
        if (headwordEntry.pronunciations) {
            pronunciations = headwordEntry.pronunciations;
        } else {
            for (const lexEntry of headwordEntry.lexicalEntries) {
                for (const entry of lexEntry.entries) {
                    if (entry.pronunciations) {
                        pronunciations = entry.pronunciations
                    }
                }
            }
        }
        const p = pronunciations.find(({ audioFile }) => audioFile !== undefined);
        if (!p) throw new Error("pron don't exit " + spell);

        const pron = new Pronunciation();
        pron.voc = spell;
        pron.audio = p.audioFile;
        pron.phonetic = p.phoneticSpelling

        const proReg = db.getRepository(Pronunciation);
        if ((await proReg.count({ where: { voc: spell } })) > 0) {
            logger.info(`[sync]{${spell}}:pron skip`)
        } else {
            proReg.save(pron);
            logger.info(`[sync]{${spell}}:pron save success`)
        }
    }


    logger.info(`[sync]{${spell}}:property check`)
    const { lexicalEntries } = headwordEntry;
    for (const lexEntry of lexicalEntries) {
        const { lexicalCategory } = lexEntry;
        let property = new Property();
        property.voc = spell;
        property.prop = lexicalCategory.id;
        const propReg = db.getRepository(Property);
        const props = await propReg.find({ where: { voc: spell } });
        if (props.length > 0) {
            property = props[0]
            logger.info(`[sync]{${spell}}:prop skip`)
        } else {
            property = await propReg.save(property);
            logger.info(`[sync]{${spell}}:property_${property.prop} save success`);
        }

        const { entries } = lexEntry;
        for (const entry of entries) {
            const { senses } = entry;

            for (const sense of senses) {
                const { definitions, examples } = sense;

                let mean = new Meaning();
                mean.voc = spell;
                mean.content = definitions[0];
                mean.propId = property.id;

                const meanReg = db.getRepository(Meaning);
                let meanFound = await meanReg.find({ where: { voc: spell, propId: property.id, content: mean.content } })
                if (meanFound.length > 0) {
                    mean = meanFound[0]
                    logger.info(`[sync]{${spell}}:meaning ${mean.content} skip`);
                } else {
                    mean = await meanReg.save(mean)
                    logger.info(`[sync]{${spell}}:meaning save success ${mean.id}`);
                }

                const exReg = db.getRepository(Example);
                for (const example of examples) {
                    let e = new Example();
                    e.voc = spell;
                    e.meanId = mean.id
                    e.example = example.text

                    const exCount = await exReg.count({ where: { voc: spell, meanId: mean.id, example: e.example } });
                    logger.info(`[sync]{${spell}}:example check mean.id ${mean.id}, count ${exCount}`)
                    if (exCount > 0) {
                        logger.info(`[sync]{${spell}}:example ${e.example} skip`)
                    } else {
                        logger.info(`[sync]{${spell}}:example start to save ${JSON.stringify(e)}`);
                        e = await exReg.save(e)
                        logger.info(`[sync]{${spell}}:example ${e.example} save success`)
                    }
                }
            }
        }
    }
}
import * as throttle from 'lodash.throttle';

import { MemorizeServiceHandlers } from "@/methods/memorize/MemorizeService";
import { TriggerWordSyncRequest } from "@/methods/memorize/TriggerWordSyncRequest";
import { TriggerWordSyncResponse } from "@/methods/memorize/TriggerWordSyncResponse";
import { getVoc } from '@/vocabularies';
import pino from '@/logger';
import { Voc, Property, Pronunciation, Meaning, Example } from '@/entity/voc';
import { AppDataSource } from '@/data-source';
import { getWord, PronunciationsList, HeadwordEntry } from '@/api/words';
import { Task } from '@/entity/task';

const logger = pino.child({ module: 'triggerWordSync' });


export const triggerWordSync: MemorizeServiceHandlers['TriggerWordSync'] = (call, callback) => {
    asyncToDB(call.request).then(resp => {
        return callback(null, resp);
    }).catch(err => {
        return callback(err, {});
    })
}

export async function asyncToDB(r: TriggerWordSyncRequest): Promise<TriggerWordSyncResponse> {
    try {
        const taskReg = AppDataSource.getRepository(Task);
        const tasks = await taskReg.find({ where: { finished: false } });
        if (tasks.length > 0) {
            const task = tasks[0]
            return { id: task.id };
        }

        const words = await getVoc(r.cla, r.offset, r.limit);

        let task = new Task();
        task.claList = r.cla;
        task.total = words.length
        task = await taskReg.save(task);

        logger.info(`[syncWordToDB] start sync...cla=${JSON.stringify(r.cla)}, total=${words.length}`)
        const exec = async () => {
            await Promise.all(words.map(async (word, index) => {
                logger.info(`[syncWordToDB]start to sync ${index}:${word.voc}`);
                const res = await getWord('en-us', word.voc);

                await sync(task, word.cla, word.voc, res.results)

                logger.info(`[syncWordToDB]finish ${index + 1}/${words.length}`);
            }));
            task.complete = words.length;
            task.finished = true;
            await taskReg.save(task);
            logger.info(`[syncWordToDB] finish sync! exit!`);
        }
        exec().catch(err => logger.error(`[exec] sync task error: ${err.message}`));

        return { id: task.id };
    } catch (err) {
        logger.error('[syncWordToDB] occur error!')
        console.error(`[syncWordToDB] ${err.message}`);
        throw err;
    }
}

async function sync(task: Task, cla: string, spell: string, headwordEntries: HeadwordEntry[]): Promise<void> {
    logger.info(`[sync]{${spell}}:async start`)
    const vocReg = AppDataSource.getRepository(Voc);

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

    headwordEntries = headwordEntries.filter(({ word }) => word === spell);
    if (!headwordEntries.length) throw new Error('can not find word ' + spell)

    // save pronunciation
    logger.info(`[sync]{${spell}}:pronunciation check`)
    {
        let pronunciations: PronunciationsList = [];
        for (const entry of headwordEntries) {
            if (entry.pronunciations) {
                pronunciations = pronunciations.concat(entry.pronunciations);
            } else {
                for (const lexEntry of entry.lexicalEntries) {
                    for (const entry of lexEntry.entries) {
                        if (entry.pronunciations) {
                            pronunciations = pronunciations.concat(entry.pronunciations)
                        }
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

        const proReg = AppDataSource.getRepository(Pronunciation);
        if ((await proReg.count({ where: { voc: spell } })) > 0) {
            logger.info(`[sync]{${spell}}:pron skip`)
        } else {
            proReg.save(pron);
            logger.info(`[sync]{${spell}}:pron save success`)
        }
    }

    for (const entry of headwordEntries) {
        logger.info(`[sync]{${spell}}:property check`)
        const { lexicalEntries } = entry;
        for (const lexEntry of lexicalEntries) {
            const { lexicalCategory } = lexEntry;
            let property = new Property();
            property.voc = spell;
            property.prop = lexicalCategory.id;
            const propReg = AppDataSource.getRepository(Property);
            const props = await propReg.find({ where: { voc: spell, prop: property.prop } });
            if (props.length > 0) {
                property = props[0]
                logger.info(`[sync]{${spell}}:prop skip`)
            } else {
                property = await propReg.save(property);
                logger.info(`[sync]{${spell}}:property_${property.prop} save success`);
            }

            const { entries } = lexEntry;
            for (const entry of entries) {
                const { senses = [] } = entry;

                for (const sense of senses) {
                    const { definitions = [], examples = [] } = sense;

                    let mean = new Meaning();
                    mean.voc = spell;
                    mean.content = definitions[0];
                    mean.propId = property.id;

                    const meanReg = AppDataSource.getRepository(Meaning);
                    let meanFound = await meanReg.find({ where: { voc: spell, propId: property.id, content: mean.content } })
                    if (meanFound.length > 0) {
                        mean = meanFound[0]
                        logger.info(`[sync]{${spell}}:meaning ${mean.content} skip`);
                    } else {
                        mean = await meanReg.save(mean)
                        logger.info(`[sync]{${spell}}:meaning save success ${mean.id}`);
                    }

                    const exReg = AppDataSource.getRepository(Example);
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

}
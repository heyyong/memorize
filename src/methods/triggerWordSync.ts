import { MemorizeServiceHandlers } from "@/methods/memorize/MemorizeService";
import { TriggerWordSyncRequest } from "@/methods/memorize/TriggerWordSyncRequest";
import { TriggerWordSyncResponse } from "@/methods/memorize/TriggerWordSyncResponse";
import pino from '@/logger';
import { Voc, Property, Pronunciation, Meaning, Example } from '@/entity/voc';
import { AppDataSource } from '@/data-source';
import { getWord, PronunciationsList, HeadwordEntry } from '@/api/words';
import { Task } from '@/entity/task';
import { In, Like } from 'typeorm';

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

        const vocReg = AppDataSource.getRepository(Voc)
        const words = await vocReg.findBy({
            cla: Like(r.cla || ''),
            voc: r.words === undefined ? undefined : In(r.words)
        });

        let task = new Task();
        task.claList = [r.cla];
        task.total = words.length
        task = await taskReg.save(task);

        logger.info(`[syncWordToDB] start sync...cla=${JSON.stringify(r.cla)}, total=${words.length}`)
        const exec = async () => {
            await Promise.all(words.map(async (voc, index) => {
                logger.info(`[syncWordToDB]start to sync ${index}:${voc.voc}`);
                const res = await getWord('en-us', voc.voc);

                await sync(task, voc, res.results)

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

async function sync(task: Task, voc: Voc, headwordEntries: HeadwordEntry[]): Promise<void> {
    logger.info(`[sync]{${voc.voc}}:async start`)
    const vocReg = AppDataSource.getRepository(Voc);

    headwordEntries = headwordEntries.filter(({ word }) => word === voc.voc);
    if (!headwordEntries.length) throw new Error('can not find word ' + voc.voc)

    // save pronunciation
    logger.info(`[sync]{${voc.voc}}:pronunciation check`)
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
        if (!p) throw new Error("pron don't exit " + voc.voc);

        const pron = new Pronunciation();
        pron.voc = voc.voc;
        pron.audio = p.audioFile;
        pron.phonetic = p.phoneticSpelling

        const proReg = AppDataSource.getRepository(Pronunciation);
        if ((await proReg.count({ where: { voc: voc.voc } })) > 0) {
            logger.info(`[sync]{${voc.voc}}:pron skip`)
        } else {
            proReg.save(pron);
            logger.info(`[sync]{${voc.voc}}:pron save success`)
        }
    }

    for (const entry of headwordEntries) {
        logger.info(`[sync]{${voc.voc}}:property check`)
        const { lexicalEntries } = entry;
        for (const lexEntry of lexicalEntries) {
            const { lexicalCategory } = lexEntry;
            let property = new Property();
            property.voc = voc.voc;
            property.prop = lexicalCategory.id;
            const propReg = AppDataSource.getRepository(Property);
            const props = await propReg.find({ where: { voc: voc.voc, prop: property.prop } });
            if (props.length > 0) {
                property = props[0]
                logger.info(`[sync]{${voc.voc}}:prop skip`)
            } else {
                property = await propReg.save(property);
                logger.info(`[sync]{${voc.voc}}:property_${property.prop} save success`);
            }

            const { entries } = lexEntry;
            for (const entry of entries) {
                const { senses = [] } = entry;

                for (const sense of senses) {
                    const { definitions = [], examples = [] } = sense;

                    let mean = new Meaning();
                    mean.voc = voc.voc;
                    mean.content = definitions[0];
                    mean.propId = property.id;

                    const meanReg = AppDataSource.getRepository(Meaning);
                    let meanFound = await meanReg.find({ where: { voc: voc.voc, propId: property.id, content: mean.content } })
                    if (meanFound.length > 0) {
                        mean = meanFound[0]
                        logger.info(`[sync]{${voc.voc}}:meaning ${mean.content} skip`);
                    } else {
                        mean = await meanReg.save(mean)
                        logger.info(`[sync]{${voc.voc}}:meaning save success ${mean.id}`);
                    }

                    const exReg = AppDataSource.getRepository(Example);
                    for (const example of examples) {
                        let e = new Example();
                        e.voc = voc.voc;
                        e.meanId = mean.id
                        e.example = example.text

                        const exCount = await exReg.count({ where: { voc: voc.voc, meanId: mean.id, example: e.example } });
                        logger.info(`[sync]{${voc.voc}}:example check mean.id ${mean.id}, count ${exCount}`)
                        if (exCount > 0) {
                            logger.info(`[sync]{${voc.voc}}:example ${e.example} skip`)
                        } else {
                            logger.info(`[sync]{${voc.voc}}:example start to save ${JSON.stringify(e)}`);
                            e = await exReg.save(e)
                            logger.info(`[sync]{${voc.voc}}:example ${e.example} save success`)
                        }
                    }
                }
            }
        }
    }

}
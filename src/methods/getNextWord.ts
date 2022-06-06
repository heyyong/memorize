import { AppDataSource } from "@/data-source";
import { MemorizedPlan, MemorizedRecord, Voc } from "@/entity/voc";
import { GetNextWordRequest } from "@/methods/memorize/GetNextWordRequest";
import { GetNextWordResponse } from "@/methods/memorize/GetNextWordResponse";
import { MemorizeServiceHandlers } from "@/methods/memorize/MemorizeService";
import { Word } from '@/methods/memorize/Word';
import pino from '@/logger';
import { composeWords } from "@/methods/common";

const logger = pino.child({ module: 'getNextWord' });

export const getNextWord: MemorizeServiceHandlers['GetNextWord'] = (call, callback) => {
    nextWord(call.request).then(resp => callback(null, resp)).catch(err => {
        logger.error(err);
        callback(err, null)
    });
}

async function nextWord(r: GetNextWordRequest): Promise<GetNextWordResponse> {
    let { planId, spell } = r;


    const planReg = AppDataSource.getRepository(MemorizedPlan);

    let plan = await planReg.findOne({ where: { id: planId } });
    if (!plan || plan.rand.length === 0) throw new Error(`Invalid memorized plan ${planId}`);
    if (spell && plan.rand.indexOf(spell) < 0) {
        throw new Error(`Dont find spell ${spell} in plan ${planId}`);
    }

    let currI: number = plan.memorized;
    logger.info(`[nextWord] assign currI=${currI}`)

    const vocReg = AppDataSource.getRepository(Voc);
    while (currI < (plan.rand.length - 1) && plan.memorizing.length < 5) {
        currI++;
        plan.memorizing.push(plan.rand[currI]);
    }
    logger.info(`[nextWord] push memorizing=%o`, plan.memorizing);

    let next: Word | undefined = undefined;
    if (plan.memorizing.length) {
        let nextW: string = plan.memorizing[0];
        while (plan.memorizing.length > 1) {
            const nextI = Math.floor(Math.random() * plan.memorizing.length)
            nextW = plan.memorizing[nextI];
            if (nextW === spell) {
                continue;
            }
            break;
        }

        logger.info(`[nextWord] nextW=${nextW}`);

        const mVoc = await vocReg.findOne({ where: { voc: nextW } });
        const voc = await composeWords([mVoc]);

        next = voc[0];
    }

    plan.memorized = currI;
    if (next === undefined) {
        plan.finished = true;
    }
    await planReg.save(plan);

    return {
        word: next,
        offset: plan.memorized,
        total: plan.rand.length,
    };
}
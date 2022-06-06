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

    let currI: number;
    if (!spell) {
        currI = plan.memorized;
    } else {
        currI = plan.rand.indexOf(spell);
        if (currI < 0) throw new Error(`Dont find spell ${spell} in plan ${planId}`);
    }

    const recReg = AppDataSource.getRepository(MemorizedRecord);
    const vocReg = AppDataSource.getRepository(Voc);

    let next: Word | undefined = undefined;
    while (currI !== (plan.rand.length - 1)) {
        currI += 1;
        spell = plan.rand[currI];
        logger.info(`[nextWord] currI=${currI} spell=${spell}`)

        let rec = await recReg.findOne({ where: { voc: spell, memorized_plan_id: planId } });
        if (!rec) {
            rec = new MemorizedRecord();
            rec.voc = spell;
            rec.memorized_plan_id = planId;
            rec = await recReg.save(rec);
            logger.info(`[nextWord] rec=${rec}`)
        }

        if (rec.count > 3) {
            continue
        }

        const mVoc = await vocReg.findOne({ where: { voc: spell } });
        const voc = await composeWords([mVoc]);

        next = voc[0];
        break;
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
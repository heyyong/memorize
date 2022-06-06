import { AppDataSource } from "@/data-source";
import { MemorizedPlan, MemorizedRecord, Voc } from "@/entity/voc";
import { MarkWordRequest } from "@/methods/memorize/MarkWordRequest";
import { MarkWordResponse } from "@/methods/memorize/MarkWordResponse";
import { MemorizeServiceHandlers } from "@/methods/memorize/MemorizeService";
import pino from '@/logger';

const logger = pino.child({ module: 'markWord' });

export const markWord: MemorizeServiceHandlers['MarkWord'] = (call, callback) => {
    mark(call.request).then(resp => callback(null, resp)).catch(err => callback(err, null));
}

async function mark(r: MarkWordRequest): Promise<MarkWordResponse> {
    const { planId, word, status } = r;

    const planReg = AppDataSource.getRepository(MemorizedPlan);

    const plan = await planReg.findOneOrFail({ where: { id: planId } });
    if (!plan.rand.includes(word))
        throw new Error(`Plan dont contains word ${word}`);

    const vocReg = AppDataSource.getRepository(Voc);
    await vocReg.findOneOrFail({ where: { voc: word } });

    const recReg = AppDataSource.getRepository(MemorizedRecord);
    let rec = await recReg.findOne({ where: { voc: word, memorized_plan_id: planId } });
    if (!rec) {
        rec = new MemorizedRecord();
        rec.voc = word;
        rec.memorized_plan_id = planId;

        rec = await recReg.save(rec);
    }

    logger.info(`[mark] update rec status=${status}`);
    if (status === 'Approvad') {
        rec.count++;
        logger.info(`[mark] word=${word} status=${status}, count=${rec.count}`)

        if (rec.count >= 3) {
            plan.memorizing = plan.memorizing.filter(m => m !== word);
            logger.info(`[mark] remove ${word} from memorizing %o`, plan.memorizing)
        }
    } else {
        rec.count = 0;
    }

    await planReg.save(plan);
    rec = await recReg.save(rec);

    return { id: rec.id };
}
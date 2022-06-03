import { AppDataSource } from "@/data-source";
import { MemorizedPlan, MemorizedRecord, Voc } from "@/entity/voc";
import { MarkWordRequest } from "@/methods/memorize/MarkWordRequest";
import { MarkWordResponse } from "@/methods/memorize/MarkWordResponse";
import { MemorizeServiceHandlers } from "@/methods/memorize/MemorizeService";

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

    if (status === 'Approvad')
        rec.count++;
    else
        rec.count = 0;

    rec = await recReg.save(rec);

    return { id: rec.id };
}
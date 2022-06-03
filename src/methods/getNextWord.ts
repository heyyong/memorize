import { AppDataSource } from "@/data-source";
import { MemorizedPlan, MemorizedRecord } from "@/entity/voc";
import { GetNextWordRequest } from "@/methods/memorize/GetNextWordRequest";
import { GetNextWordResponse } from "@/methods/memorize/GetNextWordResponse";
import { MemorizeServiceHandlers } from "@/methods/memorize/MemorizeService";
import pino from '@/logger';

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

    if (spell === "$$EOF$$") return { word: "$$EOF$$" };
    if (spell === "$$START$$") spell = plan.rand[0];
    let currI = plan.rand.indexOf(spell);

    if (currI < 0) throw new Error(`Dont find spell ${spell} in plan ${planId}`);

    const recReg = AppDataSource.getRepository(MemorizedRecord);
    while (currI !== (plan.rand.length - 1)) {
        currI += 1;
        spell = plan.rand[currI];

        let rec = await recReg.findOne({ where: { voc: spell, memorized_plan_id: planId } });
        if (!rec) {
            let rec = new MemorizedRecord();
            rec.voc = spell;
            rec.memorized_plan_id = planId;
            await recReg.save(rec);

            return { word: spell };
        }

        if (rec.count > 3) continue;

        return { word: spell };
    }

    return {
        word: '$$EOF$$'
    };
}
import { MemorizeServiceHandlers } from "./memorize/MemorizeService";
import { MemorizedPlan, Voc } from "../entity/voc";
import { GenNewMemorizePlanRequest } from "./memorize/GenNewMemorizePlanRequest";
import { GenNewMemorizePlanResponse } from "./memorize/GenNewMemorizePlanResponse";
import { AppDataSource } from "@/data-source";
import { Between } from "typeorm";

export const genNewMemorizePlan: MemorizeServiceHandlers['GenNewMemorizePlan'] = (call, callback) => {
    newMemorizePlan(call.request).then(resp => callback(null, resp)).catch(err => callback(err, null));
}

async function newMemorizePlan(r: GenNewMemorizePlanRequest): Promise<GenNewMemorizePlanResponse> {
    const planReg = AppDataSource.getRepository(MemorizedPlan);
    const vocReg = AppDataSource.getRepository(Voc);

    let plans = await planReg.find({ where: { finished: false }, order: { created: 'DESC' }, });
    if (plans.length > 0) {
        const plan = plans.pop();

        return { planId: plan.id };
    }

    let vocs = await vocReg.findOne({
        order: {
            id: "DESC",
        },
    });

    const { count } = r;
    let start = 0;
    let end = 0;
    {
        const lastPlan = await planReg.findOne({ where: { finished: true }, order: { created: 'DESC' } })
        if (lastPlan) {
            start = lastPlan.id;
        }

        end = start + count;
    }


    if (vocs === undefined) {
        throw new Error(`No valid vocabularies`);
    } else if (vocs[0].id < end) {
        throw new Error(`Check your to index. oversize`);
    }

    const vocIDList = (await vocReg.findBy({ id: Between(start, end) })).map(voc => voc.voc);

    let plan = new MemorizedPlan();

    plan.from = start;
    plan.to = end;
    plan.rand = vocIDList.sort((a, b) => Math.random() - 0.5);

    plan = await planReg.save(plan);

    return { planId: plan.id };
}
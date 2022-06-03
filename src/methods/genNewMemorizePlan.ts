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

    const plans = await planReg.find({ where: { finished: false } });
    if (plans.length > 0) {
        const plan = plans.pop();

        return { planId: plan.id };
    }

    const { from, to } = r;
    let vocs = await vocReg.find({
        order: {
            id: "DESC",
        },
        take: 1,
    });

    if (vocs.length === 0) {
        throw new Error(`No valid vocabularies`);
    } else if (vocs[0].id < to) {
        throw new Error(`Check your to index. oversize`);
    }

    const vocIDList = (await vocReg.findBy({ id: Between(from, to) })).map(voc => voc.voc);

    let plan = new MemorizedPlan();

    plan.from = from;
    plan.to = to;
    plan.rand = vocIDList.sort((a, b) => Math.random() - 0.5);

    plan = await planReg.save(plan);

    return { planId: plan.id };
}
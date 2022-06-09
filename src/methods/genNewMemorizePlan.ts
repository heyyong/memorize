import { MemorizeServiceHandlers } from "./memorize/MemorizeService";
import { MemorizedPlan, Voc } from "../entity/voc";
import { GenNewMemorizePlanRequest } from "./memorize/GenNewMemorizePlanRequest";
import { GenNewMemorizePlanResponse } from "./memorize/GenNewMemorizePlanResponse";
import { AppDataSource } from "@/data-source";
import { Between } from "typeorm";
import pino from '@/logger';
import { asyncToDB } from './triggerWordSync';

const logger = pino.child({ module: 'genNewMemorizePlan' });

export const genNewMemorizePlan: MemorizeServiceHandlers['GenNewMemorizePlan'] = (call, callback) => {
    newMemorizePlan(call.request).then(resp => callback(null, resp)).catch(err => {
        logger.error(`[genNewMemorizePlan] error=%o`, err);
        callback(err, null)
    });
}

async function newMemorizePlan(r: GenNewMemorizePlanRequest): Promise<GenNewMemorizePlanResponse> {

    const planReg = AppDataSource.getRepository(MemorizedPlan);
    const vocReg = AppDataSource.getRepository(Voc);

    let plans = await planReg.find({ where: { finished: false }, order: { created: 'DESC' }, });
    if (plans.length > 0) {
        const plan = plans.pop();
        logger.error(`[newMemorizePlan] return exist plan`);

        return { planId: plan.id };
    }

    const { count } = r;
    let start = 0, end = 0;

    const lPlans = await planReg.find({ where: { finished: true }, order: { created: 'DESC' } })
    const lPlan = lPlans[0];
    if (lPlan) {
        start = lPlan.to;
    }
    end = start + count;
    logger.info(`[newMemorizePlan] start=${start}, end=${end}`);

    {
        let [voc] = await vocReg.find({
            order: {
                id: "DESC",
            },
            take: 1,
        });

        if (voc === undefined) {
            throw new Error(`No valid vocabularies`);
        } else if (voc.id < end) {
            throw new Error(`Check your to index. oversize`);
        }
    }
    logger.info(`[newMemorizePlan] create new plan`);

    let plan = new MemorizedPlan();

    let memorized: string[] = [];
    {
        const vocs = await vocReg.findBy({ id: Between(start, end), });
        memorized = vocs.map(voc => voc.voc);

        plan.from = start;
        plan.to = end;
    }

    let review: string[] = [];
    if (lPlan) {
        const vocs = await vocReg.findBy({ id: Between(lPlan.from, lPlan.to) });
        review = vocs.map(voc => voc.voc);

        plan.rFrom = lPlan.from;
        plan.rTo = lPlan.to;
    }


    plan.rand = memorized.concat(review).sort((a, b) => Math.random() - 0.5);

    plan = await planReg.save(plan);

    return { planId: plan.id };
}
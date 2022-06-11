import { GetClaListRequest } from "@/methods/memorize/GetClaListRequest";
import { GetClaListResponse } from "@/methods/memorize/GetClaListResponse";
import pino from '@/logger';
import { MemorizeServiceHandlers } from "@/methods/memorize/MemorizeService";
import { AppDataSource } from "@/data-source";
import { Voc } from '@/entity/voc';

const logger = pino.child({ module: 'getClaList' });

export const getClaList: MemorizeServiceHandlers['GetClaList'] = (call, callback) => {
    getCla(call.request).then(resp => {
        return callback(null, resp);
    }).catch(err => {
        return callback(err, null);
    })
}

async function getCla(r: GetClaListRequest): Promise<GetClaListResponse> {
    const vocReg = AppDataSource.getRepository(Voc);

    const results = await vocReg
        .createQueryBuilder('v')
        .select('cla')
        .distinctOn(['cla'])
        .getRawMany();

    const claMap: Record<string, boolean> = {}
    for (let res of results) {
        const claStr = res.cla || '';
        for (const c of claStr.split(',')) {
            claMap[c] = true;
        }
    }

    return {
        cla: Object.keys(claMap),
    };
}
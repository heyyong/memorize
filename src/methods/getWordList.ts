import { AppDataSource } from "@/data-source"
import { Voc } from "@/entity/voc"
import { GetWordListRequest } from "@/methods/memorize/GetWordListRequest"
import { GetWordListResponse } from "@/methods/memorize/GetWordListResponse"
import { MemorizeServiceHandlers } from "@/methods/memorize/MemorizeService"
import pino from '@/logger';
import { composeWords } from "@/methods/common"

const logger = pino.child({ module: 'getWordList' });

export const getWordList: MemorizeServiceHandlers['GetWordList'] = (call, callback) => {
    getWords(call.request).then(resp => callback(null, resp)).catch(err => {
        logger.error(err);
        callback(err, null);
    });
}

async function getWords(r: GetWordListRequest): Promise<GetWordListResponse> {
    const vocReg = AppDataSource.getRepository(Voc);

    const count = await vocReg.count();
    const mVocs = await vocReg.find({
        skip: r.offset,
        take: r.pageSize,
    });

    const words = await composeWords(mVocs)

    return {
        wordList: words,
        count: words.length,
        offset: r.offset,
        total: count,
    };
}
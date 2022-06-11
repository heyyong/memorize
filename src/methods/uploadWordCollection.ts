import { UploadWordCollectionRequest } from "@/methods/memorize/UploadWordCollectionRequest";
import { UploadWordCollectionResponse } from "@/methods/memorize/UploadWordCollectionResponse";
import pino from '@/logger';
import { Voc } from '@/entity/voc';
import { AppDataSource } from "@/data-source";
import { MemorizeServiceHandlers } from "@/methods/memorize/MemorizeService";

const logger = pino.child({ module: 'uploadWordCollection' });

export const uploadWordCollection: MemorizeServiceHandlers['UploadWordCollection'] = (call, callback) => {
    upload(call.request).then(resp => {
        return callback(null, resp);
    }).catch(err => {
        return callback(err, {});
    });
}

async function upload(r: UploadWordCollectionRequest): Promise<UploadWordCollectionResponse> {
    try {
        const vocReg = AppDataSource.getRepository(Voc);

        const results = await Promise.allSettled(r.vocList.map(async ({ voc, cla }) => {
            let v = await vocReg.findOne({ where: { voc } });
            if (!v) {
                v = new Voc();
                v.voc = voc;
                v.cla = [cla];
            } else {
                if (!v.cla.includes(cla)) {
                    v.cla.push(cla);
                }
            }

            v = await vocReg.save(v);

            logger.info(`[upload] save voc ${voc} success!`)

            return v;
        }));

        logger.info(`[upload] total =${r.vocList.length}`);

        const resp: UploadWordCollectionResponse = {
            failedWords: [],
        };

        for (let i = 0; i < results.length; i++) {
            if (results[i].status === 'rejected') {
                const voc = r.vocList[i].voc;
                resp.failedWords.push(voc);
            }
        }

        return resp;
    } catch (err) {
        logger.error('[uploadWordCollection] occur error')
        logger.error(`[uploadWordCollection] ${err.message}`);
        throw err;
    }
}
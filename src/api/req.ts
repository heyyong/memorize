import axios, { AxiosError } from 'axios';

import pino from '../logger';

const logger = pino.child({ module: 'api' });

const appId = '751158d8';
const appKey = '	14d4581556902e75921389cfa01c0a34';

const api = axios.create({
    baseURL: 'https://od-api.oxforddictionaries.com',
    headers: {
        app_id: appId,
        app_key: appKey,
    },
});

api.interceptors.response.use((response) => response, (err: AxiosError) => {
    const { data, status, headers } = err.response;
    const { baseURL, url } = err.response.config;

    throw new Error(`url=${baseURL}${url} ${status}`);
})

export const get = api.get;
export const post = api.post;

type Handler = (...args: any[]) => Promise<any>;

export function taskQueue<T extends Handler>(limit: number, limitPerMinute: number, handler: T): T {
    let current = 0;
    let countPerMinute = 0;
    let timeWindow = new Date().getTime();
    const q: [any[], [(value: any) => void, (value: any) => void]][] = [];

    let inWait = 0;
    const execute = () => {
        if (q.length === 0) return;
        if (current >= limit) return;

        const now = new Date().getTime();
        const winRemain = (timeWindow + 60 * 1000 - now)
        if (winRemain > 0) {
            if (countPerMinute >= limitPerMinute) {
                inWait++;
                logger.debug(`[taskQueue]inWait = ${inWait}, winRemain = ${winRemain}`)
                setTimeout(() => {
                    inWait--;
                    logger.debug(`[taskQueue]inWait = ${inWait}, recover time window`)
                    execute();
                }, timeWindow + (60 * 1000) - now)
                return;
            } else {
                countPerMinute++;
                logger.debug(`[taskQueue]countPerLimit = ${countPerMinute}, winRemain = ${winRemain}`);
            }
        } else {
            countPerMinute = 0;
            timeWindow = now;
        }

        const [args, [resolve, reject]] = q.shift();

        current++;
        handler(...args).then(v => {
            current--;

            execute();

            resolve(v);
        }).catch((v) => {
            current--;

            execute();

            reject(v);
        });
    }

    return ((...args: any[]) => {
        return new Promise<T>((resolve, reject) => {
            q.push([args, [resolve, reject]])
            logger.debug(`[taskQueue] queue ${q.length}`);

            execute();
        });
    }) as T;
}
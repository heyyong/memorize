import { IContextLogger } from "@/context";

type Handler = (...args: any[]) => Promise<any>;


export function taskQueue<T extends Handler>(context: IContextLogger, limit: number, limitPerMinute: number, handler: T): T {
    let current = 0;
    let timeWindow = new Date().getTime();

    type Resolve = (value: any) => void;
    type Reject = (value: any) => void;
    type Args = any[];
    const q: [Args, [Resolve, Reject]][] = [];

    let countPerMinute = 0;
    let inWait = 0;
    let nextSchedule: null | NodeJS.Timeout = null;

    const execute = () => {
        if (q.length === 0) return;
        if (current >= limit) return;

        const now = new Date().getTime();
        const winRemain = (timeWindow + 60 * 1000 - now);

        if (winRemain > 0 && (countPerMinute >= limitPerMinute)) {
            inWait++;
            context.log.debug(`[taskQueue]inWait = ${inWait}, winRemain = ${winRemain}`)
            if (nextSchedule !== null) {
                nextSchedule = setTimeout(() => {
                    nextSchedule = null, timeWindow = new Date().getTime();
                    context.log.debug(`[taskQueue]inWait = ${inWait}, recover time window`)

                    // consume inWait to zero
                    while (inWait--)
                        execute();

                }, winRemain);
            }

            return;
        } else if (winRemain > 0 && (countPerMinute < limitPerMinute)) {
            countPerMinute++;
            context.log.debug(`[taskQueue]countPerLimit = ${countPerMinute}, winRemain = ${winRemain}`);
        } else {
            countPerMinute = 1; // Becuase excute is been calling, so we set it to 1.
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

    return ((...args: Args) => {
        return new Promise<T>((resolve, reject) => {
            q.push([args, [resolve, reject]])
            context.log.debug(`[taskQueue] queue ${q.length}`);

            execute();
        });
    }) as T;
}
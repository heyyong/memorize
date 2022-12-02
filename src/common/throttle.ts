export function throttle<T extends Function>(func: T, timeFrame: number) {
    var lastTime = 0;
    return function (...args: any[]) {
        var now = new Date().getTime();
        if (now - lastTime >= timeFrame) {
            func(...args);
            lastTime = now;
        }
    } as unknown as T;
}
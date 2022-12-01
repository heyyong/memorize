import pino, { LoggerOptions, DestinationStream } from 'pino'

type Logger = pino.Logger<(LoggerOptions | DestinationStream) & pino.ChildLoggerOptions>;

export interface IContextLogger {
    log: Logger;
}

export interface IContext extends IContextLogger {

}
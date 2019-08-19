import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

export enum RxJsLoggingLevel { TRACE, DEBUG, INFO, ERROR}

let rxjsLoggingLevel = RxJsLoggingLevel.INFO;

export function setRxJsLoggingLevel(level: RxJsLoggingLevel) {
    rxjsLoggingLevel = level;
}

export const debug = (level: RxJsLoggingLevel, message: string) =>
    (source: Observable<any>) => source.pipe(tap(val => {
        level >= rxjsLoggingLevel && console.log(message + ': ', val);
    }));

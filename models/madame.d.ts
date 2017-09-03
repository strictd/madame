import { Observer } from 'rxjs/Observer';
export declare class IServerInfo {
    url: string;
    host?: string;
    cookie?: string;
}
export declare class IServerList {
    [index: string]: IServerInfo;
}
export declare class IHeaderInfo {
    key: string;
    val: string;
}
export declare class IHeaderList {
    [index: string]: IHeaderInfo;
}
export declare class IMadameQuery {
    method: string;
    url: string;
    data?: any;
    query_string?: any;
    server?: string;
    headers?: IHeaderList;
}
export declare class IMadameQue {
    query: IMadameQuery;
    observer: Observer<any>;
    running?: boolean;
    error?: string;
}

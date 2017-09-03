import { IServerList, IServerInfo } from './models/madame';
import { MadameService } from './madame-service';
export declare class MadameSocket extends MadameService {
    sockets: any;
    initFuncs: any;
    serverList: IServerList;
    setServer(server: string, url: string, host?: string, cookie?: string): void;
    setHost(server: string, host: string, cookie?: string): void;
    setCookie(server: string, cookie: string): void;
    getServers(): IServerList;
    getServer(server: string): IServerInfo;
    getURL(server: string): string;
    getCookie(server: string): string;
    getHost(server: string): string;
    openSocket(server?: string, jwt?: string): void;
    emit(socket: string, eventName: string, data: any, _cb?: Function, _cbfail?: Function): void;
    s4(): string;
}

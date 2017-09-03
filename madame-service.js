"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const http_1 = require("@angular/http");
const Observable_1 = require("rxjs/Observable");
const angular2_jwt_1 = require("angular2-jwt");
require("rxjs/add/operator/share");
let MadameService = class MadameService {
    constructor(_http, _authHttp) {
        this.serverList = {
            'main': {
                'url': 'http://localhost:3000/',
                'host': document.location.host,
                'cookie': document.cookie
            }
        };
        this.runningQue = false;
        this.madameCounter = 0;
        this.queStash = [];
        this._runningCount = 0;
        this.http = _http;
        this.authHttp = _authHttp;
        this._que = new Observable_1.Observable((observer) => {
            this.que = observer;
        }).share();
        this._que.subscribe((que) => {
            this.tryQue(que);
        });
        this.needsAuth = new Observable_1.Observable((observer) => {
            this._needsAuth = observer;
        }).share();
        this.running = new Observable_1.Observable((observer) => {
            this._running = observer;
        }).share();
    }
    setServer(server, url, host, cookie) {
        if (url.trim().slice(-1) === '\\') {
            url = url.substring(0, url.length - 1);
        }
        if (url.trim().slice(-1) !== '/') {
            url += '/';
        }
        this.serverList[server] = this.initServer(url, host, cookie);
    }
    initServer(url, host, cookie) {
        return {
            'url': (typeof url !== 'undefined') ? url : '',
            'host': (typeof host !== 'undefined') ? host : '',
            'cookie': (typeof cookie !== 'undefined') ? cookie : ''
        };
    }
    setHost(server, host, cookie) {
        this.serverList[server].host = host;
        if (typeof cookie !== 'undefined') {
            this.setCookie(server, cookie);
        }
    }
    setCookie(server, cookie) {
        this.serverList[server].cookie = cookie;
    }
    setLoginObserver(observer) {
        this.loginObserv = observer;
    }
    getAuthHook() {
        return this.needsAuth;
    }
    getRunningHook() {
        return this.running;
    }
    getServers() {
        return this.serverList;
    }
    getServer(server) {
        if (this.serverList.hasOwnProperty(server)) {
            return this.serverList[server];
        }
        const serverKeys = Object.keys(this.serverList);
        if (serverKeys.length) {
            return this.serverList[serverKeys[0]];
        }
        return null;
    }
    getURL(server) {
        const serv = this.getServer(server);
        if (serv) {
            return this.serverList[server].url;
        }
        else {
            return '';
        }
    }
    getCookie(server) {
        return this.serverList[server].cookie;
    }
    getHost(server) {
        return this.serverList[server].host;
    }
    get(url, server = 'main', headers) {
        const serverInfo = this.getServer(server) || this.initServer();
        return this.http.get(`${serverInfo.url}${url}`, { headers: this.defaultHeaders(headers) });
    }
    post(url, data, server = 'main', headers) {
        const serverInfo = this.getServer(server) || this.initServer();
        return this.http.post(`${serverInfo.url}${url}`, JSON.stringify(data), { headers: this.defaultHeaders(headers) });
    }
    put(url, data, server = 'main', headers) {
        const serverInfo = this.getServer(server) || this.initServer();
        return this.http.put(`${serverInfo.url}${url}`, JSON.stringify(data), { headers: this.defaultHeaders(headers) });
    }
    delete(url, server = 'main', headers) {
        const serverInfo = this.getServer(server) || this.initServer();
        return this.http.delete(`${serverInfo.url}${url}`, { headers: this.defaultHeaders(headers) });
    }
    authGet(url, server = 'main', headers) {
        const serverInfo = this.getServer(server) || this.initServer();
        return this.authHttp.get(`${serverInfo.url}${url}`, { headers: this.defaultHeaders(headers) });
    }
    authPost(url, data, server = 'main', headers) {
        const serverInfo = this.getServer(server) || this.initServer();
        return this.authHttp.post(`${serverInfo.url}${url}`, JSON.stringify(data), { headers: this.defaultHeaders(headers) });
    }
    authPut(url, data, server = 'main', headers) {
        const serverInfo = this.getServer(server) || this.initServer();
        return this.authHttp.put(`${serverInfo.url}${url}`, JSON.stringify(data), { headers: this.defaultHeaders(headers) });
    }
    authDelete(url, server = 'main', headers) {
        const serverInfo = this.getServer(server) || this.initServer();
        return this.authHttp.delete(`${serverInfo.url}${url}`, { headers: this.defaultHeaders(headers) });
    }
    createAuthQueryFromMethod(query) {
        let url = query.url;
        if (!!query.query_string && Object.keys(query.query_string).length) {
            url = `${url}?${this.queryString(query.query_string)}`;
        }
        if (query.method === 'put') {
            return this.authPut(url, query.data, query.server, query.headers);
        }
        else if (query.method === 'post') {
            return this.authPost(url, query.data, query.server, query.headers);
        }
        else if (query.method === 'delete') {
            return this.authDelete(url, query.server);
        }
        else {
            return this.authGet(url, query.server, query.headers);
        }
    }
    queueMadame(query) {
        return Observable_1.Observable.create((observer) => {
            const userQue = {
                query: query,
                observer: observer
            };
            // if (tokenNotExpired('jwt')) {
            this.que.next(userQue);
            // } else {
            //   this.queStash.push(userQue);
            //   this.reauthMadame();
            // }
        });
    }
    tryQue(que) {
        const authQuery = this.createAuthQueryFromMethod(que.query);
        que.running = true;
        this.updateRunningCount(1);
        authQuery.subscribe(resp => {
            que.running = false;
            this.updateRunningCount(-1);
            if (resp.status === 401) {
                que.error = '401';
                this.queStash.unshift(que);
                this.reauthMadame();
            }
            else {
                que.observer.next(resp);
                que.observer.complete();
            }
        }, err => {
            que.running = false;
            this.updateRunningCount(-1);
            if (err.status === 401) {
                que.error = '401';
                this.queStash.unshift(que);
                this.reauthMadame();
            }
            else {
                que.error = err;
                que.observer.error(err);
                que.observer.complete();
            }
        });
    }
    rerunQueStash() {
        this.reauthObservable = null;
        if (!this.queStash.length) {
            return;
        }
        do {
            const q = this.queStash.shift();
            this.tryQue(q);
        } while (!this.reauthObservable && this.queStash !== void 0 && this.queStash.length);
    }
    reauthMadame() {
        if (this.reauthObservable) {
            return;
        }
        this.reauthObservable = Observable_1.Observable.create((observ) => {
            this.loginObserv.next(observ);
        });
        this.reauthObservable.subscribe(resp => {
            if (resp === true) {
                this._needsAuth.next(false);
                this.rerunQueStash();
            }
            else {
                this._needsAuth.next(true);
            }
        }, () => {
            this.reauthMadame();
        }, () => {
            this.reauthObservable = null;
        });
    }
    updateRunningCount(by) {
        this._runningCount += by;
        if (this._runningCount === 1) {
            this._running.next(true);
        }
        else if (this._runningCount === 0) {
            this._running.next(false);
        }
    }
    clearQue() {
        this.queStash.map(q => {
            q.observer.complete();
        });
        this.queStash = [];
        this.updateRunningCount(this._runningCount - (this._runningCount * 2));
    }
    defaultHeaders(toAdd) {
        let headers = new http_1.Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        if (toAdd) {
            headers = this.addHeaders(toAdd, headers);
        }
        return headers;
    }
    addHeaders(toAdd, cur) {
        if (!cur) {
            cur = new http_1.Headers();
        }
        for (const h in toAdd) {
            if (toAdd.hasOwnProperty(h)) {
                cur.append(toAdd[h].key, toAdd[h].val);
            }
        }
        return cur;
    }
    queryString(obj) {
        const str = [];
        for (const p in obj) {
            if (obj.hasOwnProperty(p) && typeof obj[p] !== 'undefined') {
                str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p].toString()));
            }
        }
        return str.join('&');
    }
};
MadameService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http, angular2_jwt_1.AuthHttp])
], MadameService);
exports.MadameService = MadameService;

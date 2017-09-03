"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var Observable_1 = require("rxjs/Observable");
var angular2_jwt_1 = require("angular2-jwt");
require("rxjs/add/operator/share");
var MadameService = (function () {
    function MadameService(_http, _authHttp) {
        var _this = this;
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
        this._que = new Observable_1.Observable(function (observer) {
            _this.que = observer;
        }).share();
        this._que.subscribe(function (que) {
            _this.tryQue(que);
        });
        this.needsAuth = new Observable_1.Observable(function (observer) {
            _this._needsAuth = observer;
        }).share();
        this.running = new Observable_1.Observable(function (observer) {
            _this._running = observer;
        }).share();
    }
    MadameService.prototype.setServer = function (server, url, host, cookie) {
        if (url.trim().slice(-1) === '\\') {
            url = url.substring(0, url.length - 1);
        }
        if (url.trim().slice(-1) !== '/') {
            url += '/';
        }
        this.serverList[server] = this.initServer(url, host, cookie);
    };
    MadameService.prototype.initServer = function (url, host, cookie) {
        return {
            'url': (typeof url !== 'undefined') ? url : '',
            'host': (typeof host !== 'undefined') ? host : '',
            'cookie': (typeof cookie !== 'undefined') ? cookie : ''
        };
    };
    MadameService.prototype.setHost = function (server, host, cookie) {
        this.serverList[server].host = host;
        if (typeof cookie !== 'undefined') {
            this.setCookie(server, cookie);
        }
    };
    MadameService.prototype.setCookie = function (server, cookie) {
        this.serverList[server].cookie = cookie;
    };
    MadameService.prototype.setLoginObserver = function (observer) {
        this.loginObserv = observer;
    };
    MadameService.prototype.getAuthHook = function () {
        return this.needsAuth;
    };
    MadameService.prototype.getRunningHook = function () {
        return this.running;
    };
    MadameService.prototype.getServers = function () {
        return this.serverList;
    };
    MadameService.prototype.getServer = function (server) {
        if (this.serverList.hasOwnProperty(server)) {
            return this.serverList[server];
        }
        var serverKeys = Object.keys(this.serverList);
        if (serverKeys.length) {
            return this.serverList[serverKeys[0]];
        }
        return null;
    };
    MadameService.prototype.getURL = function (server) {
        var serv = this.getServer(server);
        if (serv) {
            return this.serverList[server].url;
        }
        else {
            return '';
        }
    };
    MadameService.prototype.getCookie = function (server) {
        return this.serverList[server].cookie;
    };
    MadameService.prototype.getHost = function (server) {
        return this.serverList[server].host;
    };
    MadameService.prototype.get = function (url, server, headers) {
        if (server === void 0) { server = 'main'; }
        var serverInfo = this.getServer(server) || this.initServer();
        return this.http.get("" + serverInfo.url + url, { headers: this.defaultHeaders(headers) });
    };
    MadameService.prototype.post = function (url, data, server, headers) {
        if (server === void 0) { server = 'main'; }
        var serverInfo = this.getServer(server) || this.initServer();
        return this.http.post("" + serverInfo.url + url, JSON.stringify(data), { headers: this.defaultHeaders(headers) });
    };
    MadameService.prototype.put = function (url, data, server, headers) {
        if (server === void 0) { server = 'main'; }
        var serverInfo = this.getServer(server) || this.initServer();
        return this.http.put("" + serverInfo.url + url, JSON.stringify(data), { headers: this.defaultHeaders(headers) });
    };
    MadameService.prototype.delete = function (url, server, headers) {
        if (server === void 0) { server = 'main'; }
        var serverInfo = this.getServer(server) || this.initServer();
        return this.http.delete("" + serverInfo.url + url, { headers: this.defaultHeaders(headers) });
    };
    MadameService.prototype.authGet = function (url, server, headers) {
        if (server === void 0) { server = 'main'; }
        var serverInfo = this.getServer(server) || this.initServer();
        return this.authHttp.get("" + serverInfo.url + url, { headers: this.defaultHeaders(headers) });
    };
    MadameService.prototype.authPost = function (url, data, server, headers) {
        if (server === void 0) { server = 'main'; }
        var serverInfo = this.getServer(server) || this.initServer();
        return this.authHttp.post("" + serverInfo.url + url, JSON.stringify(data), { headers: this.defaultHeaders(headers) });
    };
    MadameService.prototype.authPut = function (url, data, server, headers) {
        if (server === void 0) { server = 'main'; }
        var serverInfo = this.getServer(server) || this.initServer();
        return this.authHttp.put("" + serverInfo.url + url, JSON.stringify(data), { headers: this.defaultHeaders(headers) });
    };
    MadameService.prototype.authDelete = function (url, server, headers) {
        if (server === void 0) { server = 'main'; }
        var serverInfo = this.getServer(server) || this.initServer();
        return this.authHttp.delete("" + serverInfo.url + url, { headers: this.defaultHeaders(headers) });
    };
    MadameService.prototype.createAuthQueryFromMethod = function (query) {
        var url = query.url;
        if (!!query.query_string && Object.keys(query.query_string).length) {
            url = url + "?" + this.queryString(query.query_string);
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
    };
    MadameService.prototype.queueMadame = function (query) {
        var _this = this;
        return Observable_1.Observable.create(function (observer) {
            var userQue = {
                query: query,
                observer: observer
            };
            // if (tokenNotExpired('jwt')) {
            _this.que.next(userQue);
            // } else {
            //   this.queStash.push(userQue);
            //   this.reauthMadame();
            // }
        });
    };
    MadameService.prototype.tryQue = function (que) {
        var _this = this;
        var authQuery = this.createAuthQueryFromMethod(que.query);
        que.running = true;
        this.updateRunningCount(1);
        authQuery.subscribe(function (resp) {
            que.running = false;
            _this.updateRunningCount(-1);
            if (resp.status === 401) {
                que.error = '401';
                _this.queStash.unshift(que);
                _this.reauthMadame();
            }
            else {
                que.observer.next(resp);
                que.observer.complete();
            }
        }, function (err) {
            que.running = false;
            _this.updateRunningCount(-1);
            if (err.status === 401) {
                que.error = '401';
                _this.queStash.unshift(que);
                _this.reauthMadame();
            }
            else {
                que.error = err;
                que.observer.error(err);
                que.observer.complete();
            }
        });
    };
    MadameService.prototype.rerunQueStash = function () {
        this.reauthObservable = null;
        if (!this.queStash.length) {
            return;
        }
        do {
            var q = this.queStash.shift();
            this.tryQue(q);
        } while (!this.reauthObservable && this.queStash !== void 0 && this.queStash.length);
    };
    MadameService.prototype.reauthMadame = function () {
        var _this = this;
        if (this.reauthObservable) {
            return;
        }
        this.reauthObservable = Observable_1.Observable.create(function (observ) {
            _this.loginObserv.next(observ);
        });
        this.reauthObservable.subscribe(function (resp) {
            if (resp === true) {
                _this._needsAuth.next(false);
                _this.rerunQueStash();
            }
            else {
                _this._needsAuth.next(true);
            }
        }, function () {
            _this.reauthMadame();
        }, function () {
            _this.reauthObservable = null;
        });
    };
    MadameService.prototype.updateRunningCount = function (by) {
        this._runningCount += by;
        if (this._runningCount === 1) {
            this._running.next(true);
        }
        else if (this._runningCount === 0) {
            this._running.next(false);
        }
    };
    MadameService.prototype.clearQue = function () {
        this.queStash.map(function (q) {
            q.observer.complete();
        });
        this.queStash = [];
        this.updateRunningCount(this._runningCount - (this._runningCount * 2));
    };
    MadameService.prototype.defaultHeaders = function (toAdd) {
        var headers = new http_1.Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        if (toAdd) {
            headers = this.addHeaders(toAdd, headers);
        }
        return headers;
    };
    MadameService.prototype.addHeaders = function (toAdd, cur) {
        if (!cur) {
            cur = new http_1.Headers();
        }
        for (var h in toAdd) {
            if (toAdd.hasOwnProperty(h)) {
                cur.append(toAdd[h].key, toAdd[h].val);
            }
        }
        return cur;
    };
    MadameService.prototype.queryString = function (obj) {
        var str = [];
        for (var p in obj) {
            if (obj.hasOwnProperty(p) && typeof obj[p] !== 'undefined') {
                str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p].toString()));
            }
        }
        return str.join('&');
    };
    MadameService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http, angular2_jwt_1.AuthHttp])
    ], MadameService);
    return MadameService;
}());
exports.MadameService = MadameService;

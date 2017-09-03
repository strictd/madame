"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Rx = require("rxjs/Rx");
var madame_service_1 = require("./madame-service");
var MadameSocket = (function (_super) {
    __extends(MadameSocket, _super);
    function MadameSocket() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.sockets = {};
        _this.initFuncs = [];
        _this.serverList = {
            'main': {
                'url': 'http://localhost:3000',
                'host': document.location.host,
                'cookie': document.cookie
            }
        };
        return _this;
    }
    MadameSocket.prototype.setServer = function (server, url, host, cookie) {
        if (url.trim().slice(-1) === '/' || url.trim().slice(-1) === '\\') {
            url = url.substring(0, url.length - 1);
        }
        this.serverList[server].url = url;
        if (typeof host !== 'undefined') {
            this.setHost(server, host);
        }
        if (typeof cookie !== 'undefined') {
            this.setCookie(server, cookie);
        }
    };
    MadameSocket.prototype.setHost = function (server, host, cookie) {
        this.serverList[server].host = host;
        if (typeof cookie !== 'undefined') {
            this.setCookie(server, cookie);
        }
    };
    MadameSocket.prototype.setCookie = function (server, cookie) {
        this.serverList[server].cookie = cookie;
    };
    MadameSocket.prototype.getServers = function () {
        return this.serverList;
    };
    MadameSocket.prototype.getServer = function (server) {
        return this.serverList[server];
    };
    MadameSocket.prototype.getURL = function (server) {
        return this.serverList[server].url;
    };
    MadameSocket.prototype.getCookie = function (server) {
        return this.serverList[server].cookie;
    };
    MadameSocket.prototype.getHost = function (server) {
        return this.serverList[server].host;
    };
    MadameSocket.prototype.openSocket = function (server, jwt) {
        if (server === void 0) { server = 'main'; }
        var _t = this;
        this.sockets[server] = {};
        this.sockets[server].io = io.connect(this.serverList[server].url, {
            'reconnection': true,
            'reconnectionDelay': 1000,
            'reconnectionAttempts': 10
        });
        this.sockets[server].calls = {};
        var _loop_1 = function (socket) {
            if (!this_1.sockets.hasOwnProperty(socket)) {
                return "continue";
            }
            this_1.sockets[socket].connect = Rx.Observable.create(function (observer) {
                var ob = observer;
                _t.sockets[socket].io.on('connect', function () { ob.next(true); });
            });
            this_1.sockets[socket].auth = Rx.Observable.create(function (observer) {
                _t.sockets[socket].io.on('auth', function (data) { observer.next(data); });
            });
            // console.log('load socket: ', socket);
            this_1.sockets[socket].connect.subscribe(function () {
                _t.sockets[socket].io.on('authenticated', function () {
                })
                    .emit('authenticate', { token: jwt });
            });
            // this.sockets[socket].connect.subscribe(() => _t.sockets[socket].io.emit('authenticate', {host: this.serverList[server].host, cookie: this.serverList[server].cookie }));
            this_1.sockets[socket].auth.subscribe(function (data) {
                console.log('We have authed', data);
            });
            /*
                  this.sockets[socket].io.on('authfail', function() {
                    console.log('Authentication Failure');
                  });
                  this.sockets[socket].io.on('connect_error', function(data) {
                    console.log('Connect Error', arguments);
                  });
            
                  this.sockets[socket].io.on('connect_timeout', function() {
                    console.log('Connect Timeout', arguments)
                  });
                  this.sockets[socket].io.on('reconnect', function(data) {
                    console.log('Reconnect', arguments);
                  });
                  this.sockets[socket].io.on('reconnect_attempt', function() {
                    console.log('Reconnect Attempt', arguments);
                  });
                  this.sockets[socket].io.on('reconnect_error', function(data) {
                    console.log('Reconnect Error', arguments);
                  });
                  this.sockets[socket].io.on('reconnect_failed', function() {
                    console.log('Reconnect Failed', arguments);
                  });
            
                  this.sockets[socket].io.on('error', function() {
                    console.log('Error', arguments);
                  });
                  this.sockets[socket].io.on('connect', function() {
                    console.log('Connect', arguments);
                  });
                  this.sockets[socket].io.on('disconnect', function() {
                    console.log('Disconnect', arguments);
                  });
            */
            this_1.sockets[socket].io.on('socketReturn', function (cbData) {
                // console.log('Return Socket', _t.sockets[socket].calls, cbData);
                if (typeof cbData === 'undefined' || typeof cbData.socketTag === 'undefined') {
                    return;
                }
                if (typeof _t.sockets[socket].calls[cbData.socketTag] === 'undefined') {
                    return;
                }
                if (typeof _t.sockets[socket].calls[cbData.socketTag].callback !== 'undefined') {
                    _t.sockets[socket].calls[cbData.socketTag].callback.apply(_t.sockets[socket], arguments);
                }
                delete _t.sockets[socket].calls[cbData.socketTag];
            });
            this_1.sockets[socket].io.on('socketFail', function (cbData) {
                if (typeof cbData === 'undefined' || typeof cbData.socketTag === 'undefined') {
                    return;
                }
                if (typeof _t.sockets[socket].calls[cbData.socketTag] === 'undefined') {
                    return;
                }
                if (typeof _t.sockets[socket].calls[cbData.socketTag].callfail !== 'undefined') {
                    _t.sockets[socket].calls[cbData.socketTag].callfail.apply(_t.sockets[socket], arguments);
                }
                delete _t.sockets[socket].calls[cbData.socketTag];
            });
        };
        var this_1 = this;
        for (var socket in this.sockets) {
            _loop_1(socket);
        }
    };
    MadameSocket.prototype.emit = function (socket, eventName, data, _cb, _cbfail) {
        if (_cb === void 0) { _cb = null; }
        if (_cbfail === void 0) { _cbfail = null; }
        if (typeof data.socketTag === 'undefined') {
            data.socketTag = 'b' + this.s4() + this.s4() + this.s4();
        }
        this.sockets[socket].calls[data.socketTag] = {};
        if (!!_cb) {
            this.sockets[socket].calls[data.socketTag].callback = _cb;
        }
        if (!!_cbfail) {
            this.sockets[socket].calls[data.socketTag].callfail = _cbfail;
        }
        this.sockets[socket].io.emit(eventName, data, function () { alert('Failed To Emit'); });
    };
    //  on() { }
    //  removeAllListeners() { }
    MadameSocket.prototype.s4 = function () { return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1); };
    MadameSocket = __decorate([
        core_1.Injectable()
    ], MadameSocket);
    return MadameSocket;
}(madame_service_1.MadameService));
exports.MadameSocket = MadameSocket;

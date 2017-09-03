"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var http_1 = require("@angular/http");
var angular2_jwt_1 = require("angular2-jwt");
var madame_service_1 = require("./madame-service");
var madame_socket_1 = require("./madame-socket");
function authHttpServiceFactory(http, options) {
    return new angular2_jwt_1.AuthHttp(new angular2_jwt_1.AuthConfig({
        headerName: 'Authorization',
        headerPrefix: 'bearer',
        tokenName: 'jwt',
        tokenGetter: (function () { return localStorage.getItem('jwt'); }),
        // globalHeaders: [{ 'Content-Type': 'application/json' }],
        noJwtError: true
    }), http, options);
}
exports.authHttpServiceFactory = authHttpServiceFactory;
var MadameModule = (function () {
    function MadameModule() {
    }
    MadameModule_1 = MadameModule;
    MadameModule.forRoot = function () {
        return {
            ngModule: MadameModule_1,
            providers: [
                {
                    provide: angular2_jwt_1.AuthHttp,
                    useFactory: authHttpServiceFactory,
                    deps: [http_1.Http, http_1.RequestOptions]
                },
                angular2_jwt_1.JwtHelper,
                madame_service_1.MadameService,
                madame_socket_1.MadameSocket
            ]
        };
    };
    MadameModule = MadameModule_1 = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule],
            exports: [common_1.CommonModule]
        })
    ], MadameModule);
    return MadameModule;
    var MadameModule_1;
}());
exports.MadameModule = MadameModule;

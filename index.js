"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const http_1 = require("@angular/http");
const angular2_jwt_1 = require("angular2-jwt");
const madame_service_1 = require("./madame-service");
const madame_socket_1 = require("./madame-socket");
function authHttpServiceFactory(http, options) {
    return new angular2_jwt_1.AuthHttp(new angular2_jwt_1.AuthConfig({
        headerName: 'Authorization',
        headerPrefix: 'bearer',
        tokenName: 'jwt',
        tokenGetter: (() => localStorage.getItem('jwt')),
        // globalHeaders: [{ 'Content-Type': 'application/json' }],
        noJwtError: true
    }), http, options);
}
exports.authHttpServiceFactory = authHttpServiceFactory;
let MadameModule = MadameModule_1 = class MadameModule {
    static forRoot() {
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
    }
};
MadameModule = MadameModule_1 = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule, http_1.HttpModule],
        exports: [common_1.CommonModule]
    })
], MadameModule);
exports.MadameModule = MadameModule;
var MadameModule_1;

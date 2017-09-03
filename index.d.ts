import { ModuleWithProviders } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
export declare function authHttpServiceFactory(http: Http, options: RequestOptions): AuthHttp;
export declare class MadameModule {
    static forRoot(): ModuleWithProviders;
}

import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http, RequestOptions } from '@angular/http';
import { JwtHelper, AuthHttp, AuthConfig } from 'angular2-jwt';
import { MadameService } from './madame-service';
import { MadameSocket } from './madame-socket';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    headerName: 'Authorization',
    headerPrefix: 'bearer',
    tokenName: 'jwt',
    tokenGetter: (() => localStorage.getItem('jwt')),
    // globalHeaders: [{ 'Content-Type': 'application/json' }],
    noJwtError: true
  }), http, options);
}

@NgModule({
  imports: [ CommonModule ],
  exports: [ CommonModule ]
})
export class MadameModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MadameModule,
      providers: [
        {
          provide: AuthHttp,
          useFactory: authHttpServiceFactory,
          deps: [Http, RequestOptions]
        },
        JwtHelper,
        MadameService,
        MadameSocket
      ]
    };
  }
}


### NgX client side http proxy library with jwt and sockets

## Typescript only library

## NGX Implementation
### app.module addition, import recaptcha component to imports
```ts
import { MadameModule } from '@strictd/madame';

@NgModule({
  imports: [
    MadameModule.forRoot()
  ]
})
```

### Component TS / HTML Addition
```ts
import { MadameService } from '../../../../../_shared/madame/madame-service';

// export class <myclass> {
  constructor(private service: MadameService) {
    service.setServer('main', 'http://localhost:3000/'); // <-- Set your API url

//    // Set madames event emitter is actively running request;
//    this.localRunningHook = service.getRunningHook().subscribe(
//      (isRunning: boolean) => { console.log('Madame Running: ' + isRunning.toString()); }
//    );
  }

//  // Destroy subscription to the service running hook
//  ngOnDestroy() {
//    this.localRunningHook.unsubscribe();
//  }

  runRequests() {
    this.service.post('myapi/endpoint.php', {foo: 'bar'}).then(resp => {
      console.log('Request Response', resp);
    });

    this.service.get('myapi/endpoint.php',).then(resp => {
      console.log('Request Response', resp);
    });

    this.service.authPost('myapi/endpoint.php', {foo: 'bar'}).then(resp => {
      console.log('Request Response', resp);
    });
  }
//}
```


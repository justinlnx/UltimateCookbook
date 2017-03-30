import 'hammerjs';
import '../styles/styles.scss';
import '../styles/headings.css';

import {ApplicationRef, NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {MaterialModule} from '@angular/material';
import {BrowserModule} from '@angular/platform-browser';
import {PreloadAllModules, RouterModule} from '@angular/router';
import {createInputTransfer, createNewHosts, removeNgStyles} from '@angularclass/hmr';
import {AgmCoreModule} from 'angular2-google-maps/core';
import {AngularFireModule} from 'angularfire2';

import {ApiService} from './api';
// App is our top level component
import {AppComponent} from './app.component';
import {APP_RESOLVER_PROVIDERS} from './app.resolver';
import {ROUTES} from './app.routes';
import {AppState, InternalStateType} from './app.service';
/*
 * Platform and Environment providers/directives/pipes
 */
import {ENV_PROVIDERS} from './environment';
import {ErrorReportComponent, ErrorReportService} from './error-report';
import {NoContentComponent} from './no-content';
import {ShiftBottomNavigationComponent} from './shift-bottom-navigation';

// Application wide providers
const APP_PROVIDERS = [...APP_RESOLVER_PROVIDERS, AppState, ApiService, ErrorReportService];

type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

export const firebaseConfig = {
  apiKey: 'AIzaSyAHWHfEBm7GhUh4UXk63ZejmipUC3LF2a0',
  authDomain: 'cookbookdemo-6bde5.firebaseapp.com',
  databaseURL: 'https://cookbookdemo-6bde5.firebaseio.com',
  storageBucket: 'cookbookdemo-6bde5.appspot.com',
  messagingSenderId: '356763357387'
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
    NoContentComponent,
    ErrorReportComponent,
    ShiftBottomNavigationComponent
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules }),
    MaterialModule,
    AgmCoreModule.forRoot({apiKey: 'AIzaSyAHWHfEBm7GhUh4UXk63ZejmipUC3LF2a0',libraries: ['places']}),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS
  ]
})
export class AppModule {
  constructor(public appRef: ApplicationRef, public appState: AppState) {}

  public hmrOnInit(store: StoreType) {
    if (!store || !store.state) {
      return;
    }
    console.log('HMR store', JSON.stringify(store, null, 2));
    // set state
    this.appState._state = store.state;
    // set input values
    if ('restoreInputValues' in store) {
      let restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }

    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  public hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
    // save state
    const state = this.appState._state;
    store.state = state;
    // recreate root elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // save input values
    store.restoreInputValues = createInputTransfer();
    // remove styles
    removeNgStyles();
  }

  public hmrAfterDestroy(store: StoreType) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }
}

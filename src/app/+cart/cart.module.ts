import {NgModule} from '@angular/core';

import {RouterModule} from '@angular/router';
import {AgmCoreModule} from 'angular2-google-maps/core';

import {SharedModule} from '../shared';

import {CartComponent} from './cart.component';
import {routes} from './cart.routes';

@NgModule({
  imports: [
    SharedModule, RouterModule.forChild(routes),
    AgmCoreModule.forRoot({apiKey: 'AIzaSyDrxvSMaiyZkfUZFZMDiRg_alqhYaOOIBk'})
  ],
  providers: [],
  declarations: [CartComponent]
})
export class CartModule {
}

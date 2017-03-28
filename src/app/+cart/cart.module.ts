import {CommonModule} from '@angular/common';
import {ApplicationRef, NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {AgmCoreModule} from 'angular2-google-maps/core';

import {SharedModule} from '../shared';

import {CartItemComponent} from './cart-item.component';
import {CartComponent} from './cart.component';
import {routes} from './cart.routes';



// interface marker {
//   lat: number;
//   lng: number;
// }
@NgModule({
  imports: [
    CommonModule, FormsModule, SharedModule, RouterModule.forChild(routes),
    AgmCoreModule.forRoot({apiKey: 'AIzaSyDrxvSMaiyZkfUZFZMDiRg_alqhYaOOIBk'})
  ],
  providers: [],
  declarations: [CartComponent, CartItemComponent],
  bootstrap: [CartComponent]
})
export class CartModule {
}

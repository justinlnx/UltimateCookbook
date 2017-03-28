import {CommonModule} from '@angular/common';
import {ApplicationRef, NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {SharedModule} from '../shared';

import {CartItemComponent} from './cart-item.component';
import {CartComponent} from './cart.component';
import {routes} from './cart.routes';



// interface marker {
//   lat: number;
//   lng: number;
// }
@NgModule({
  imports: [CommonModule, FormsModule, SharedModule, RouterModule.forChild(routes)],
  declarations: [CartComponent, CartItemComponent],
})
export class CartModule {
}

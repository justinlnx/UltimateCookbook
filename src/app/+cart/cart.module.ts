import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared';

import { CartItemComponent } from './cart-item.component';
import { CartComponent } from './cart.component';
import { CartHomeComponent } from './cart-home.component';
import { MapComponent } from './map.component';
import { routes } from './cart.routes';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [CartComponent, CartItemComponent, MapComponent, CartHomeComponent],
})
export class CartModule {
}

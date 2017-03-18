import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {SharedModule} from '../shared';

import {CartComponent} from './cart.component';
import {routes} from './cart.routes';

@NgModule({imports: [SharedModule, RouterModule.forChild(routes)], declarations: [CartComponent]})
export class CartModule {
}
import {Routes} from '@angular/router';

import {CartHomeComponent} from './cart-home.component';
import {MapComponent} from './map.component'

export const routes: Routes = [
  {path: '', redirectTo: '/cart/home', pathMatch: 'full'},
  {path: 'home', component: CartHomeComponent}, {path: 'map/:lng/:lat', component: MapComponent}
];

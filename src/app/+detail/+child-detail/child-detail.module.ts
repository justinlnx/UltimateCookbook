import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {ChildDetailComponent} from './child-detail.component';
import {routes} from './child-detail.routes';

console.log('`Detail` bundle loaded asynchronously');

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    ChildDetailComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
  ],
})
export class ChildDetailModule {
  public static routes = routes;
}

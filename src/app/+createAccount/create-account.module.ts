import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {SharedModule} from '../shared';

import {CreateAccountComponent} from './create-account.component';
import {routes} from './create-account.routers';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [CreateAccountComponent]
})
export class CreateAccountModule {
}

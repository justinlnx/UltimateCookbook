import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared';

import {AccountComponent} from './account.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { LoginComponent } from './login/login.component'

import {routes} from './account.routes';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    AccountComponent,
    AccountSettingsComponent,
    LoginComponent
  ]
})
export class AccountModule {}

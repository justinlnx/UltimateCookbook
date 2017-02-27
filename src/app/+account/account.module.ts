import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {SharedModule} from '../shared';

import {AccountSettingsComponent} from './account-settings/account-settings.component';
import {AccountComponent} from './account.component';
import {routes} from './account.routes';
import {LoginComponent} from './login/login.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [AccountComponent, AccountSettingsComponent, LoginComponent]
})
export class AccountModule {
}

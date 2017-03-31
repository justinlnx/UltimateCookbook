import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {SharedModule} from '../shared';

import {AccountSettingsComponent} from './account-settings/account-settings.component';
import {AccountComponent} from './account.component';
import {routes} from './account.routes';
import {CreateAccountComponent} from './create-account/create-account.component';
import {LoginComponent} from './login/login.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations:
      [AccountComponent, AccountSettingsComponent, LoginComponent, CreateAccountComponent]
})
export class AccountModule {
}

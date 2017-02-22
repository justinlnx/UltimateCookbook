import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared';

import {AccountComponent} from './account.component';

import {routes} from './account.routes';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AccountComponent]
})
export class AccountModule {}

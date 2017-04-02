import {Routes} from '@angular/router';

import {AccountComponent} from './account.component';
import {CreateAccountComponent} from './create-account/create-account.component';

export const routes: Routes =
    [{path: '', component: AccountComponent}, {path: 'create', component: CreateAccountComponent}];

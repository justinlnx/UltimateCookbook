import { AccountComponent } from './account.component';

export const routes = [
  { path: '', children: [
    { path: '', component: AccountComponent }
  ]},
];

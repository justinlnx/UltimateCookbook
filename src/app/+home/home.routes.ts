import {Routes} from '@angular/router';

import {ChatroomComponent} from './chatroom';
import {ChatroomsComponent} from './chatrooms';
import {RecipeListComponent} from './recipe-list';

export const routes: Routes = [
  {path: '', redirectTo: '/home/explore', pathMatch: 'full'},
  {path: 'explore', component: RecipeListComponent},
  {path: 'chatrooms', component: ChatroomsComponent},
  {path: 'chatroom/:id', component: ChatroomComponent}
];

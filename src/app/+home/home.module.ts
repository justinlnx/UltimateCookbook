import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';

import {SharedModule} from '../shared';

import {ChatContentComponent, ChatroomComponent} from './chatroom';
import {ChatroomsComponent, ChatroomsListItemComponent} from './chatrooms';
import {HomeComponent} from './home.component';
import {routes} from './home.routes';
import {RecipeListComponent, SearchBarComponent} from './recipe-list';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [
    HomeComponent, RecipeListComponent, SearchBarComponent, ChatroomsComponent,
    ChatroomsListItemComponent, ChatroomComponent, ChatContentComponent
  ],
})
export class HomeModule {
}

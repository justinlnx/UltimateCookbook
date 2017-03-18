import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {SharedModule} from '../shared';

import {FavoriteComponent} from './favorite.component';
import {routes} from './favorite.routes';

@NgModule(
    {imports: [SharedModule, RouterModule.forChild(routes)], declarations: [FavoriteComponent]})
export class FavoriteModule {
}

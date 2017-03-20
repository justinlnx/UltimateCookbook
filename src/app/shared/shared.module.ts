import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '@angular/material';
import {AngularFireModule} from 'angularfire2';
import {RecipeListItemComponent} from './recipe-list-item.component';

@NgModule({
    imports: [CommonModule, FormsModule, MaterialModule, AngularFireModule, ReactiveFormsModule],
    declarations: [RecipeListItemComponent],
    exports: [CommonModule, FormsModule, MaterialModule, AngularFireModule, ReactiveFormsModule,
        RecipeListItemComponent]
    })
export class SharedModule {
}

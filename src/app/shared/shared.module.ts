import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '@angular/material';
import {AgmCoreModule} from 'angular2-google-maps/core';
import {AngularFireModule} from 'angularfire2';
import {FileUploadModule} from 'ng2-file-upload';

import {HiddenFileSelectorComponent} from '../file-upload';

import {LoginWarningComponent} from './login-warning.component';
import {RecipeListItemComponent} from './recipe-list-item.component';

@NgModule({
  imports: [
    CommonModule, FormsModule, MaterialModule, AngularFireModule, ReactiveFormsModule,
    AgmCoreModule, FileUploadModule
  ],
  declarations: [RecipeListItemComponent, LoginWarningComponent, HiddenFileSelectorComponent],
  exports: [
    CommonModule, FormsModule, MaterialModule, AngularFireModule, ReactiveFormsModule,
    AgmCoreModule, FileUploadModule, RecipeListItemComponent, LoginWarningComponent,
    HiddenFileSelectorComponent
  ]
})
export class SharedModule {
}

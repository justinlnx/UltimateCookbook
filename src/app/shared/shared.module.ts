import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '@angular/material';
import {AngularFireModule} from 'angularfire2';

@NgModule(
    {exports: [CommonModule, FormsModule, MaterialModule, AngularFireModule, ReactiveFormsModule]})
export class SharedModule {
}

import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';
import { FormsModule }         from '@angular/forms';
import { MaterialModule }      from '@angular/material';
import { AngularFireModule }   from 'angularfire2';

@NgModule({
  exports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    AngularFireModule
  ]
})
export class SharedModule{}

import {Component} from '@angular/core';
import {MdDialog, MdDialogRef} from '@angular/material';

@Component({
  selector: 'login.component',
  templateUrl: '../login/login.component.html',
})
export class DialogResultExample {
  selectedOption: string;

  constructor(public dialog: MdDialog) {}

  openDialog() {
    console.log('open dialog');
    let dialogRef = this.dialog.open(DialogResultExampleDialog);
    dialogRef.afterClosed().subscribe(result => {
      this.selectedOption = result;
    });
  }
}

@Component({
  selector: 'error.dialog',
  templateUrl: './error.dialog.html',
})
export class DialogResultExampleDialog {
  constructor(public dialogRef: MdDialogRef<DialogResultExampleDialog>) {}
}

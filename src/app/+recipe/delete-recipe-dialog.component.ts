import {Component} from '@angular/core';
import {MdDialogRef} from '@angular/material';

@Component({
  selector: 'delete-recipe-dialog',
  template: `
    <h1 md-dialog-title>Delete Recipe</h1>
    <div md-dialog-content>Are you sure to delete this recipe?</div>
    <div md-dialog-actions>
        <button md-button (click)="dialogRef.close('Yes')">Yes</button>
        <button md-button (click)="dialogRef.close('Cancel')">Cancel</button>
    </div>
  `,
})
export class DeleteRecipeDialogComponent {
  constructor(public dialogRef: MdDialogRef<DeleteRecipeDialogComponent>) {}
}

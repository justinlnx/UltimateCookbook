import { Component } from '@angular/core';

@Component({
  selector: 'myCookBookButton',
  template: `
    <div>
      <button type="button" class="btn-class" >
        <span class="glyphicon glyphicon-folder-close"></span>
        <p>My Cook Book</p>
      </button>
    </div>
  `
})
export class myCookBookButtonComponent{}

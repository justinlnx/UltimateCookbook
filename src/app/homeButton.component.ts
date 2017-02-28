import { Component } from '@angular/core';

@Component({
  selector: 'homeButton',
  template: `
    <div>
      <button type="button" class="btn-class" >
        <span class="glyphicon glyphicon-home"></span>
        <p>Home</p>
      </button>
    </div>
  `
})
export class homeButtonComponent{}

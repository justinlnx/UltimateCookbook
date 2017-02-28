import { Component } from '@angular/core';

@Component({
  selector: 'settingsButton',
  template: `
    <div>
      <button type="button" class="btn-class" >
        <span class="glyphicon glyphicon-cog"></span>
        <p>Settings</p>
      </button>
    </div>
  `
})
export class settingsButtonComponent{}

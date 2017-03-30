import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'search-bar',
  template: `
  <div class="search-box mat-elevation-z5">
    <md-input-container floatPlaceholder="never">
      <input mdInput (keyup)="onKeyup($event.target.value)" placeholder="Search">
    </md-input-container>
  </div>
  `,
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  @Output() public searchInputChange = new EventEmitter<string>();

  public onKeyup(input: string): void {
    this.searchInputChange.emit(input);
  }
}

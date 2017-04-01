import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'search-bar',
  template: `
  <md-input-container floatPlaceholder="never" class="white-placeholder">
    <input mdInput (keyup)="onKeyup($event.target.value)" placeholder="Search">
  </md-input-container>
  `,
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  @Output() public searchInputChange = new EventEmitter<string>();

  public onKeyup(input: string): void {
    this.searchInputChange.emit(input);
  }
}

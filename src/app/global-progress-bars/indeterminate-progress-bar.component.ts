import {Component, OnInit} from '@angular/core';

import {IndeterminateProgressBarService} from './indeterminate-progress-bar.service';

@Component({
  selector: 'indeterminate-progress-bar',
  template: `
  <div class="progress-bar">
    <md-progress-bar *ngIf="loading" color="accent" mode="indeterminate"></md-progress-bar>
  </div>
  `,
  styleUrls: ['./progress-bar.component.scss']
})
export class IndeterminateProgressBarComponent implements OnInit {
  public loading: boolean = false;

  constructor(public progressBarService: IndeterminateProgressBarService) {}

  public ngOnInit() {
    this.progressBarService.loadingObservable().subscribe((loading) => {
      this.loading = loading;
    });
  }
}

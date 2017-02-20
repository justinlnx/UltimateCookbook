import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { AppState } from './app.service';

import { AngularFire, FirebaseListObservable } from 'angularfire2';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  styleUrls: [
    './app.component.scss'
  ],
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  private items: FirebaseListObservable<any[]>;
  constructor(
    public appState: AppState,
    private af: AngularFire
  ) {
    this.items = af.database.list('/items');
  }

  public ngOnInit() {
    console.log('Initial App State', this.appState.state);
  }

}

import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { AppState } from './app.service';
import { deleteIconComponent }    from './delete.component';
import { addIconComponent }       from './add.component';
import { searchbarComponent }   from './searchbar.component';
import { mainRecipeComponent }  from './mainRecipe.component';
import { homeButtonComponent }  from './homeButton.component';
import { myCookBookButtonComponent }  from './myCookBookButton.component';
import { settingsButtonComponent }  from './settings.component';


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
  constructor(
    public appState: AppState,
  ) {
  }

  public ngOnInit() {
    console.log('Initial App State', this.appState.state);
  }

}

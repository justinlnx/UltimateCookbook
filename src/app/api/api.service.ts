import {Injectable} from '@angular/core';
import {AngularFire} from 'angularfire2';

interface Recipe {
  title: string;
}

@Injectable()
export class ApiService {
  constructor(private af: AngularFire) {}

  // for example
  public getAllRecipes(): Recipe[] {
    // this.af.database.
    return [];
  }
}

import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {ApiService, CartEntry, Recipe} from '../api';

@Component({
  selector: 'cart',
  template: `
    <md-toolbar class="top-toolbar" color="primary">
        <span>Cart</span>
    </md-toolbar>
    <login-warning *ngIf="!isLoggedIn"></login-warning>
    <div *ngIf="isLoggedIn">
    <div class="page-content">
        <md-tab-group>
            <md-tab class="list-label" label="LIST">
              <cart-item *ngFor="let cartEntry of cartObservable | async"
                          [cartEntry]="cartEntry">
              </cart-item>
            </md-tab>
            <md-tab class="location-label" label="LOCATION"></md-tab>
        </md-tab-group>
    </div>
    </div>
    `,
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  public cartObservable: Observable<CartEntry[]>;
  private loginStatusSubscription: Subscription;
  private _isLoggedIn: boolean;

  constructor(public apiService: ApiService) {}

  set isLoggedIn(status: boolean) {
    this._isLoggedIn = status;
  }

  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  public ngOnInit() {
    this.cartObservable = this.apiService.getCartObservableOfCurrentUser().first();
    this.loginStatusSubscription = this.apiService.getLoginObservable().subscribe((status) => {
      this.isLoggedIn = status;
    });
  }

  public ngOnDestroy() {
    this.loginStatusSubscription.unsubscribe();
  }
}

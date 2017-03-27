import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {ApiService, CartEntry, Recipe} from '../api';

@Component({
  selector: 'cart',
  template: `
    <md-toolbar class="top-toolbar" color="primary">
        <span>Cart</span>
    </md-toolbar>

    <div class="page-content">
        <md-tab-group>
            <md-tab class="list-label" label="LIST">
              <cart-item *ngFor="let cartEntry of cartObservable | async"
                          [cartEntry]="cartEntry">
              </cart-item>
            </md-tab>
            <md-tab class="location-label" label="LOCATION">
                <h1>{{title}}</h1>
                <sebm-google-map [latitude]="lat" [longitude]="lng">
                    <sebm-google-map-marker [latitude]="lat" [longitude]="lng">
                    </sebm-google-map-marker>
                </sebm-google-map>
            </md-tab>
        </md-tab-group>
    </div>
    `,
  styleUrls: ['./cart.component.scss']
})

export class CartComponent implements OnInit {
  public cartObservable: Observable<CartEntry[]>;

  constructor(public apiService: ApiService) {}

  public ngOnInit() {
    this.cartObservable = this.apiService.getCartObservableOfCurrentUser().first();
  }
  public title: string = 'Google Map to find stores location';
  public lat: number = 51.678418;
  public lng: number = 7.809007;
}

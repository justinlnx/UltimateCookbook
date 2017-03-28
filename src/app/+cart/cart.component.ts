import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms'
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
                <sebm-google-map [latitude]="lat" [longitude]="lng" [scrollwheel]="false" [zoom]="zoom">
                    <sebm-google-map-marker [latitude]="lat" [longitude]="lng">
                    </sebm-google-map-marker>
                    <sebm-google-map-info-window>
                      <strong>My location</strong>
                    </sebm-google-map-info-window>
                </sebm-google-map>
            </md-tab>
        </md-tab-group>
    </div>
    `,
  styleUrls: ['./cart.component.scss']
})

export class CartComponent implements OnInit {
  public title: string = 'Google Map to find stores location';
  public lat: number;
  public lng: number;
  public zoom: number;

  public cartObservable: Observable<CartEntry[]>;

  constructor(public apiService: ApiService) {}

  public ngOnInit() {
    this.cartObservable = this.apiService.getCartObservableOfCurrentUser().first();
    // set current position
    this.setCurrentPosition();
  }
  private setCurrentPosition() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 12;
        console.log(this.lat);
        console.log(this.lng);
      });
    }
  }
}

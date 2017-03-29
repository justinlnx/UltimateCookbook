import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Http} from '@angular/http';
import {MapsAPILoader} from 'angular2-google-maps/core';
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
              <md-card>
              <md-card-title>Find a store near you</md-card-title>
              <md-card-content>
                <sebm-google-map [latitude]="lat" [longitude]="lng" [zoom]="zoom">
                    <sebm-google-map-marker [latitude]="lat" [longitude]="lng">
                    </sebm-google-map-marker>
                </sebm-google-map>
                <input type="text" [(ngModel)]="address"  (setAddress)="getAddress($event)" googleplace/>
              </md-card-content>
              </md-card>
              <md-card>

              </md-card>
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
  public searchControl: FormControl;
  public zoom: number;
  public url: string;
  public nearByStores: string[];

  public cartObservable: Observable<CartEntry[]>;

  @ViewChild('search') public searchElementRef: ElementRef;
  constructor(
      public apiService: ApiService, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone,
      private http: Http) {}

  public ngOnInit() {
    this.cartObservable = this.apiService.getCartObservableOfCurrentUser().first();
    // set google maps defaults
    this.zoom = 12;
    this.lat = 0;
    this.lng = 0;
    this.searchControl = new FormControl();
    this.getAllStores();
  }

  private getAllStores() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 12;
        this.url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' +
            this.lat.toString() + ',' + this.lng.toString() +
            '&rankby=distance&types=grocery_or_supermarket&key=AIzaSyDrxvSMaiyZkfUZFZMDiRg_alqhYaOOIBk';
        this.http.get(this.url).map(response => response.json()).subscribe(data => {
          console.log('success ' + JSON.stringify(data.results));
        });
      })
    }
  }
}

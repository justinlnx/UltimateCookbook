import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
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

  public cartObservable: Observable<CartEntry[]>;

  @ViewChild('search') public searchElementRef: ElementRef;
  constructor(
      public apiService: ApiService, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) {
  }

  public ngOnInit() {
    this.cartObservable = this.apiService.getCartObservableOfCurrentUser().first();
    // set google maps defaults
    this.zoom = 12;
    this.lat = 0;
    this.lng = 0;
    this.searchControl = new FormControl();
    this.setCurrentPosition();
    // load Places Autocomplete
    // this.mapsAPILoader.load().then(() => {
    //   let autocomplete = new google.maps.places.Autocomplete(
    //       this.searchElementRef.nativeElement, {types: ['address']});
    //   autocomplete.addListener('place_changed', () => {
    //     this.ngZone.run(() => {
    //       // get the place result
    //       let place: google.maps.places.PlaceResult = autocomplete.getPlace();

    //       // verify result
    //       if (place.geometry === undefined || place.geometry === null) {
    //         return;
    //       }

    //       // set latitude, longitude and zoom
    //       this.lat = place.geometry.location.lat();
    //       this.lng = place.geometry.location.lng();
    //       this.zoom = 12;
    //     });
    //   });
    // });
  }
  private setCurrentPosition() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 12;
        console.log('you are at');
        console.log(this.lat);
        console.log(this.lng);
      });
    }
  }
}

import {Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Http, Jsonp, Response} from '@angular/http';
import {MapsAPILoader} from 'angular2-google-maps/core';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {ApiService, CartEntry, Recipe} from '../api';

interface nearByStore {
  rating: number;
  name: string;
  location: string;
}
@Component({
  selector: 'cart',
  template: `
    <md-toolbar class="top-toolbar" color="primary">
      <span>Cart</span>
    </md-toolbar>
   <div class="page-content">
     <login-warning *ngIf="!userLoggedIn"></login-warning>
    </div>
    <div *ngIf="isLoggedIn">
    <div class="page-content">
        <sebm-google-map id="map" [latitude]="lat" [longitude]="lng" [zoom]="zoom">
          <sebm-google-map-marker [latitude]="lat" [longitude]="lng">
          </sebm-google-map-marker>
        </sebm-google-map>
        <md-tab-group>
            <md-tab class="list-label" label="LIST">
              <cart-item *ngFor="let cartEntry of cartObservable | async"
                          [cartEntry]="cartEntry">
              </cart-item>
            </md-tab>
            <md-tab class="location-label" label="LOCATION">
              <md-card *ngFor="let nearByStore of nearByStores">
                <md-card-title>{{nearByStore.name}}</md-card-title>
                <md-card-content>
                <div>
                  <p>Location: {{nearByStore.location}}</p>
                  <p>Rating: {{nearByStore.rating}}/5</p>
                </div>
                </md-card-content>
              </md-card>
            </md-tab>
        </md-tab-group>
    </div>
    </div>
    `,
  styleUrls: ['./cart.component.scss']
})

export class CartComponent implements OnInit, OnDestroy {
  public title: string = 'Google Map to find stores location';
  public lat: number;
  public lng: number;
  public searchControl: FormControl;
  public zoom: number;
  public url: string;
  public nearByStores: nearByStore[] = [];
  public cartObservable: Observable<CartEntry[]>;
  private loginStatusSubscription: Subscription;
  private _isLoggedIn: boolean;

  @ViewChild('search') public searchElementRef: ElementRef;
  constructor(
      public apiService: ApiService, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone,
      private http: Http) {}

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
    // set google maps defaults
    this.zoom = 12;
    this.lat = 49.246292;
    this.lng = -123.116226;
    this.searchControl = new FormControl();
    this.getAllStores();
  }
  public ngOnDestroy() {
    this.loginStatusSubscription.unsubscribe();
  }

  private getAllStores() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
          (position) => {
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
            this.zoom = 12;
            console.log(this.lat);
            console.log(this.lng);
            this.mapsAPILoader.load().then(() => {
              let pyrmont = new google.maps.LatLng(this.lat, this.lng);
              let map = new google.maps.Map(document.getElementById('map'));
              console.log('map is ------' + map);
              let service = new google.maps.places.PlacesService(map);
              let request: any = {
                location: pyrmont,
                radius: '100000',
                openNow: true,
                rankby: google.maps.places.RankBy.DISTANCE,
                types: ['grocery_or_supermarket']
              };
              service.nearbySearch(request, (results) => {
                // console.log(results);
                for (let result of results) {
                  this.nearByStores.push(
                      {rating: result.rating, name: result.name, location: result.vicinity});
                  //  this.nearByStores.name.push(result.name);
                  // this.nearByStores.rating.push(result.rating);
                  // this.nearByStores.location.push(result.vicinity);
                }
                console.log(this.nearByStores);
              });
            });
          },
          () => {window.alert(
              'Warning: The Geolocation service failed on your device browser at current time, unable to get your current location. Please try it later :(')},
          {maximumAge: 60000, timeout: 5000, enableHighAccuracy: true});
    } else {
      console.log('Browser doesn\'t support Geolocation');
    }
  }
}

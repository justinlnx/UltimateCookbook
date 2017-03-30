import {Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Http, Jsonp, Response} from '@angular/http';
import {MapsAPILoader} from 'angular2-google-maps/core';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {ApiService, CartEntry, Recipe} from '../api';
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
              <md-card id = "map">
              <md-card-title>Find a store near you</md-card-title>
              <md-card-content>
              </md-card-content>
              </md-card>
              <md-card>
                <md-card-title>Acme Grocery Store</md-card-title>
                <md-card-content>3031 Beckman Pl, Richmond, BC V6X 3R3</md-card-content>
              </md-card>
              <md-card>
                <md-card-title>Acme Grocery Store</md-card-title>
                <md-card-content>3031 Beckman Pl, Richmond, BC V6X 3R3</md-card-content>
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
  public nearByStores: string[];

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
      navigator.geolocation.getCurrentPosition(position => {
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
          service.nearbySearch(request, (result) => {console.log(result)});
        });
      })
    }
  }
}

import {Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {MapsAPILoader} from 'angular2-google-maps/core';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';

import {ApiService, CartEntry, Recipe} from '../api';
import {ErrorReportService} from '../error-report';

interface NearByStore {
  rating: number;
  name: string;
  location: string;
  geometry: any;
}

@Component({
  selector: 'cart-home',
  template: `
  <md-toolbar class="top-toolbar" color="primary">
    <span>Cart</span>
  </md-toolbar>
  <div class="page-content">
    <login-warning *ngIf="!isLoggedIn"></login-warning>
    <div id="map"></div>
    <md-tab-group *ngIf="isLoggedIn">
      <md-tab class="list-label" label="LIST">
        <div class="warning-area" *ngIf="(cartObservable | async)?.length === 0">
          <md-icon>shopping_cart</md-icon>
          <div>You currently do not have any cart entries.</div>
        </div>
        <cart-item *ngFor="let cartEntry of cartObservable | async" [cartEntry]="cartEntry" onclick="a()"></cart-item>
      </md-tab>
      <md-tab class="location-label" label="LOCATION">
        <md-card *ngFor="let nearByStore of nearByStores" (click)="onNavigateToStoreMap(nearByStore)">
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
  `,
  styleUrls: ['./cart-home.component.scss']
})

export class CartHomeComponent implements OnInit, OnDestroy {
  public lat: number;
  public lng: number;
  public zoom: number;
  public map: any;
  public nearByStores: NearByStore[] = [];
  public cartObservable: Observable<CartEntry[]>;
  @ViewChild('search') public searchElementRef: ElementRef;

  private loginStatusSubscription: Subscription;
  private _isLoggedIn: boolean;

  constructor(
      public apiService: ApiService, private errorReportService: ErrorReportService,
      private mapsAPILoader: MapsAPILoader, public router: Router) {}

  set isLoggedIn(status: boolean) {
    this._isLoggedIn = status;
  }

  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  public ngOnInit() {
    this.cartObservable = this.apiService.getCartObservableOfCurrentUser().first();
    const defaultLat = 49.246292;
    const defaultLng = -123.116226;
    const defaultZoom = 12;
    this.zoom = defaultZoom;
    this.lat = defaultLat;
    this.lng = defaultLng;
    this.loginStatusSubscription = this.apiService.getLoginObservable().subscribe((status) => {
      this.isLoggedIn = status;
      if (this.isLoggedIn) {
        this.getAllStores();
      }
    });
  }

  public ngOnDestroy() {
    this.loginStatusSubscription.unsubscribe();
  }

  public onNavigateToStoreMap(nearByStore: NearByStore): void {
    let lng: number = nearByStore.geometry.location.lng();
    let lat: number = nearByStore.geometry.location.lat();
    this.router.navigateByUrl(`/cart/map/${lng}/${lat}`);
  }

  private getAllStores() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
          (position) => {
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
            this.zoom = 12;
            this.mapsAPILoader.load().then(() => {
              this.mapSetUp();
            });
          },
          () => {
            this.errorReportService.send('Error: Google map API fails at current time');
          },
          {maximumAge: 60000, timeout: 5000, enableHighAccuracy: true});
    } else {
      this.errorReportService.send('Browser doesn\'t support Geolocation');
    }
  }

  private mapSetUp() {
    let pyrmont = new google.maps.LatLng(this.lat, this.lng);
    let map =
        new google.maps.Map(document.getElementById('map'), {center: pyrmont, zoom: this.zoom});
    let marker = new google.maps.Marker({map, position: {lat: this.lat, lng: this.lng}});
    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
    let service = new google.maps.places.PlacesService(map);
    let request: any = {
      location: pyrmont,
      radius: '5000',
      openNow: true,
      rankby: google.maps.places.RankBy.DISTANCE,
      types: ['grocery_or_supermarket']
    };

    service.nearbySearch(request, (results) => {
      for (let result of results) {
        this.nearByStores.push({
          rating: result.rating,
          name: result.name,
          location: result.vicinity,
          geometry: result.geometry
        });
      }
    });
    this.map = map;
  }
}

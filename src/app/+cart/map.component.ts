import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from 'angular2-google-maps/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { ApiService, CartEntry, Recipe } from '../api';
import { ErrorReportService } from '../error-report';
@Component({
    selector: 'map',
    template: `
        <md-toolbar class="top-toolbar" color="primary">
            <button md-icon-button class="back-button" (click)="onNavigatingBack()">
                <md-icon>arrow_back</md-icon>
            </button>
            <span>Cart</span>
        </md-toolbar>
        <div class="page-content">
            <div id="mapForEachStore"></div>
        </div>
    `,
    styleUrls: ['./cart-home.component.scss']
})

export class MapComponent implements OnInit {
    public SelfLat: number;
    public SelfLng: number;
    public DestinationLat: number;
    public DestinationLng: number;
    public searchControl: FormControl;
    public zoom: number;
    constructor(
        public apiService: ApiService, private errorReportService: ErrorReportService, private mapsAPILoader: MapsAPILoader, public location: Location, public route: ActivatedRoute) { }

    public ngOnInit() {
        this.route.params.subscribe(
            (params: Params) => {
                this.DestinationLng = Number(params['lng']);
                this.DestinationLat = Number(params['lat']);
                this.showStore();
            }
        )
    }
    public onNavigatingBack() {
        this.location.back();
    }
    private showStore() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.SelfLat = position.coords.latitude;
                    this.SelfLng = position.coords.longitude;
                    this.zoom = 12;
                    this.mapsAPILoader.load().then(() => {
                        this.mapSetUp();
                    });
                },
                () => {
                    this.errorReportService.send('Warning: The Geolocation service failed on your device browser at current time, unable to get your current location. Please try it later ')
                },
                { maximumAge: 60000, timeout: 5000, enableHighAccuracy: true });
        } else {
            this.errorReportService.send('Browser doesn\'t support Geolocation')
        }
    }

    private mapSetUp() {
        let pyrmont = new google.maps.LatLng(this.SelfLat, this.SelfLng);
        let map =
            new google.maps.Map(document.getElementById('mapForEachStore'), { center: pyrmont, zoom: this.zoom });
        let selfMarker = new google.maps.Marker({ map: map, position: { lat: this.SelfLat, lng: this.SelfLng } });
        selfMarker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
        let destinationMarker = new google.maps.Marker({ map: map, position: { lat: this.DestinationLat, lng: this.DestinationLng } });
        let Selfinfowindow = new google.maps.InfoWindow({
            content: "current location"
        });
        let Storeinfowindow = new google.maps.InfoWindow({
            content: "store location"
        });
        Selfinfowindow.open(map, selfMarker);
        Storeinfowindow.open(map, destinationMarker);
    }
}

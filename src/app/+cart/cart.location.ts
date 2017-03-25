import {ApplicationRef, NgModule} from '@angular/core';
import {Component} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AgmCoreModule} from 'angular2-google-maps/core';

@Component({
  selector: 'app-root',
  styles: [`
		.sebm-google-map-container {
			height: 300px;
		}
	`],
  template: `
		<sebm-google-map [latitude]="lat" [longitude]="lng"></sebm-google-map>
	`
})
export class AppComponent {
  lat: number = 51.678418;
  lng: number = 7.809007;
}

@NgModule({
  imports:
      [BrowserModule, AgmCoreModule.forRoot({apiKey: 'AIzaSyCO3r_rsOGGXutONK6r1jsxsI6_1Fgn0xk'})],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}

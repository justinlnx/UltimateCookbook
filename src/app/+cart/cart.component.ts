import {Component} from '@angular/core';

@Component({
  selector: 'cart',
  template: `
    <md-toolbar class="top-toolbar" color="primary">
        <span>Cart</span>
    </md-toolbar>
    
    <div class="page-content">
        <md-tab-group>
            <md-tab class="list-label" label="LIST">
                <md-card class="mat-elevation-z8">
                    <md-card-title>
                        <span class="md-headline">Recipe_1</span>
                    </md-card-title>
                    <md-card-subtitle>
                        <span class="md-subhead">Author</span>
                    </md-card-subtitle>
                    <md-card-content>
                        <md-card-actions>
                            <md-list>
                                <md-list-item class="md-3-line" ngFor="ingredient in ingredients">
                                    <div class="ingredient-numbers"> 
                                        <span class="ingredient-numbers">5</span>
                                    </div>
                                    <div class="ingredient-name">
                                        <span>Ingredients #1</span>
                                    </div>
                                    <button md-icon-button>
                                        <md-icon class="material-icons">check_circle</md-icon>
                                    </button>
                                </md-list-item>
                            </md-list>
                        </md-card-actions>
                    </md-card-content>
                </md-card>    
            </md-tab>
            <md-tab class="location-label" label="LOCATION"></md-tab>
        </md-tab-group>
    </div>
    `,
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
}

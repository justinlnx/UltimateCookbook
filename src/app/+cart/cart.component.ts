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
                <md-card>
                    <md-card-title>
                        <span class="md-headline">Recipe_1</span>
                    </md-card-title>
                    <md-card-subtitle>
                        <span class="md-subhead">Author</span>
                    </md-card-subtitle>
                    <md-card-content>
                        <md-card-actions>
                            <button md-button>Action 1</button>
                            <button md-button>Action 2</button>
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

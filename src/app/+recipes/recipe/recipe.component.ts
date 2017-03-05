import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ApiService, Recipe } from '../../api'
import { ActivatedRoute, Params } from '@angular/router'
import {Observable} from 'rxjs/Observable';

@Component({
    selector: 'recipe',
    templateUrl: './recipe.component.html'
})
export class RecipeComponent implements OnInit {
    private recipe: Recipe;

    private trustedImageUrls: SafeResourceUrl[];

    constructor(private route: ActivatedRoute, private apiService: ApiService, private domSanitizer: DomSanitizer) { }

    ngOnInit(): void {
        this.route.params
            .switchMap((params: Params) => Observable.of(this.apiService.getRecipe(params['id'])))
            .subscribe(recipe => { 
                this.recipe;
                this.updateTrustedImageUrls();
            });
    }
    private updateTrustedImageUrls() {
        this.trustedImageUrls = this.recipe.imageSources.map((imageSource) => {
            return this.domSanitizer.bypassSecurityTrustResourceUrl(imageSource);
        });
    }
}

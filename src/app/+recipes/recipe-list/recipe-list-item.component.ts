import {Component, Input, OnInit} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

import {Recipe} from '../../api';

@Component({
  selector: 'recipe-list-item',
  template: `
  <md-list-item>
    <img md-list-avatar [src]="safeImageUrl" alt="showcase">
    <h4 md-line class="recipe-name">{{recipe.name}}</h4>
  </md-list-item>
  <md-divider></md-divider>
  `,
  styleUrls: ['./recipe-list-item.component.scss']
})
export class RecipeListItemComponent implements OnInit {
  @Input() recipe: Recipe;
  public safeImageUrl: SafeResourceUrl;

  constructor(private domSanitizer: DomSanitizer) {}

  ngOnInit() {
    this.updateBypassImageSrc();
  }

  private updateBypassImageSrc() {
    this.safeImageUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.recipe.avatar);
  }
}

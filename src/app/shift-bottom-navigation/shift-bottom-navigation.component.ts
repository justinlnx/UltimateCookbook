import {animate, Component, Input, state, style, transition, trigger} from '@angular/core';

import {Section} from './section';

export const ACTIVE_STATE = 'active';
export const INACTIVE_STATE = 'inactive';

@Component({
  selector: 'shift-bottom-navigation',
  template: `
<nav md-ripple mdRippleSpeedFactor="3.5" rippleColor="#E8EAF6">
  <a md-button class="shift-bottom-button" *ngFor="let section of sections"
     disableRipple="true"
     [routerLink]=" [section.url] " routerLinkActive="active" #rla="routerLinkActive"
     [@buttonState]="getButtonState(rla.isActive)">
    <md-icon>{{section.icon}}</md-icon>
    <title [@titleState]="getTitleState(rla.isActive)">{{section.name}}</title>
  </a>
</nav>
`,
  styleUrls: ['./shift-bottom-navigation.component.scss'],
  animations: [
    trigger(
        'buttonState',
        [
          state(INACTIVE_STATE, style({paddingTop: '16px', opacity: '0.7'})),
          state(ACTIVE_STATE, style({paddingTop: '6px', opacity: '1'})),
          transition(`${INACTIVE_STATE} => ${ACTIVE_STATE}`, animate('100ms ease-in')),
          transition(`${ACTIVE_STATE} => ${INACTIVE_STATE}`, animate('100ms ease-out'))
        ]),
    trigger(
        'titleState',
        [
          state(INACTIVE_STATE, style({opacity: '0'})), state(ACTIVE_STATE, style({opacity: '1'})),
          transition(`${INACTIVE_STATE} => ${ACTIVE_STATE}`, animate('100ms ease-in')),
          transition(`${ACTIVE_STATE} => ${INACTIVE_STATE}`, animate('100ms ease-out'))
        ])
  ]
})
export class ShiftBottomNavigationComponent {
  @Input() public sections: Section[];

  public getButtonState(isActive: boolean): string {
    return isActive ? ACTIVE_STATE : INACTIVE_STATE;
  }

  public getTitleState(isActive: boolean): string {
    return isActive ? ACTIVE_STATE : INACTIVE_STATE;
  }
}

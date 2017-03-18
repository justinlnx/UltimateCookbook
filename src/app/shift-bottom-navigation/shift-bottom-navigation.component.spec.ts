import {ShiftBottomNavigationComponent} from './shift-bottom-navigation.component';
import {ACTIVE_STATE, INACTIVE_STATE} from './shift-bottom-navigation.component';

describe('shift bottom navigation (isolated)', () => {
  let component: ShiftBottomNavigationComponent;

  beforeEach(() => {
    component = new ShiftBottomNavigationComponent();
  });

  it('should return correct states for button animation', () => {
    expect(component.getButtonState(true)).toEqual(ACTIVE_STATE);
    expect(component.getButtonState(false)).toEqual(INACTIVE_STATE);
  });

  it('should return correct states for button title animation', () => {
    expect(component.getTitleState(true)).toEqual(ACTIVE_STATE);
    expect(component.getTitleState(false)).toEqual(INACTIVE_STATE);
  });
});

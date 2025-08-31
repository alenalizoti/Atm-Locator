import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationMap } from './navigation-map';

describe('NavigationMap', () => {
  let component: NavigationMap;
  let fixture: ComponentFixture<NavigationMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationMap],
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationMap);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

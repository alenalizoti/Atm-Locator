import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PinCodePanel } from './pin-code-panel';

describe('PinCodePanel', () => {
  let component: PinCodePanel;
  let fixture: ComponentFixture<PinCodePanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PinCodePanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PinCodePanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

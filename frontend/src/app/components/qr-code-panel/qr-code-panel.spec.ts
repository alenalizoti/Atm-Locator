import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrCodePanel } from './qr-code-panel';

describe('QrCodePanel', () => {
  let component: QrCodePanel;
  let fixture: ComponentFixture<QrCodePanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrCodePanel],
    }).compileComponents();

    fixture = TestBed.createComponent(QrCodePanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

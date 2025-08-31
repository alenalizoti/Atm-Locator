import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionStorage } from './transaction-storage';

describe('TransactionStorage', () => {
  let component: TransactionStorage;
  let fixture: ComponentFixture<TransactionStorage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionStorage],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionStorage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

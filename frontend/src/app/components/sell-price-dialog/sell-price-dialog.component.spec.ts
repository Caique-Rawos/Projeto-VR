import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellPriceDialogComponent } from './sell-price-dialog.component';

describe('SellPriceDialogComponent', () => {
  let component: SellPriceDialogComponent;
  let fixture: ComponentFixture<SellPriceDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SellPriceDialogComponent]
    });
    fixture = TestBed.createComponent(SellPriceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

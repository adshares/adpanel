import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizeAdvertiserDialogComponent } from './customize-advertiser-dialog.component';

describe('CustomizeAdvertiserDialogComponent', () => {
  let component: CustomizeAdvertiserDialogComponent;
  let fixture: ComponentFixture<CustomizeAdvertiserDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomizeAdvertiserDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomizeAdvertiserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

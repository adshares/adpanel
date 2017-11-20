import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizeAccountChooseDialogComponent } from './customize-account-choose-dialog.component';

describe('CustomizeAccountChooseDialogComponent', () => {
  let component: CustomizeAccountChooseDialogComponent;
  let fixture: ComponentFixture<CustomizeAccountChooseDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomizeAccountChooseDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomizeAccountChooseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

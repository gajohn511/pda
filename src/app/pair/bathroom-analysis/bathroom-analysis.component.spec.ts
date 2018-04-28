import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BathroomAnalysisComponent } from './bathroom-analysis.component';

describe('BathroomAnalysisComponent', () => {
  let component: BathroomAnalysisComponent;
  let fixture: ComponentFixture<BathroomAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BathroomAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BathroomAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

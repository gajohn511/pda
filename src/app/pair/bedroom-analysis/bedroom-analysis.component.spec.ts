import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BedroomAnalysisComponent } from './bedroom-analysis.component';

describe('BedroomAnalysisComponent', () => {
  let component: BedroomAnalysisComponent;
  let fixture: ComponentFixture<BedroomAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BedroomAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BedroomAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

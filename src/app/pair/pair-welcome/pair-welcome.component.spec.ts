import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PairWelcomeComponent } from './pair-welcome.component';

describe('PairWelcomeComponent', () => {
  let component: PairWelcomeComponent;
  let fixture: ComponentFixture<PairWelcomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PairWelcomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PairWelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordableSubjectSearcherComponent } from './recordable-subject-searcher.component';

describe('RecordableSubjectSearcherComponent', () => {
  let component: RecordableSubjectSearcherComponent;
  let fixture: ComponentFixture<RecordableSubjectSearcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordableSubjectSearcherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordableSubjectSearcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

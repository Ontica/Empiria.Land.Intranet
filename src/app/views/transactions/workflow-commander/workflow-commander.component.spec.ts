import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowCommanderComponent } from './workflow-commander.component';

describe('WorkflowCommanderComponent', () => {
  let component: WorkflowCommanderComponent;
  let fixture: ComponentFixture<WorkflowCommanderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowCommanderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowCommanderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

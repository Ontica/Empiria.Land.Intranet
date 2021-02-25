import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowCommandConfigComponent } from './workflow-command-config.component';

describe('WorkflowCommandConfigComponent', () => {
  let component: WorkflowCommandConfigComponent;
  let fixture: ComponentFixture<WorkflowCommandConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowCommandConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowCommandConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

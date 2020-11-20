import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestFilesListComponent } from './request-files-list.component';

describe('RequestFilesListComponent', () => {
  let component: RequestFilesListComponent;
  let fixture: ComponentFixture<RequestFilesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestFilesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestFilesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

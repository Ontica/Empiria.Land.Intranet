import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateCreatorComponent } from './certificate-creator.component';

describe('CertificateCreatorComponent', () => {
  let component: CertificateCreatorComponent;
  let fixture: ComponentFixture<CertificateCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CertificateCreatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificateCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeHeadimageComponent } from './liste-headimage.component';

describe('ListeHeadimageComponent', () => {
  let component: ListeHeadimageComponent;
  let fixture: ComponentFixture<ListeHeadimageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListeHeadimageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeHeadimageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

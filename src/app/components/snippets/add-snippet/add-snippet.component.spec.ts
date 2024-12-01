import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSnippetComponent } from './add-snippet.component';

describe('AddSnippetComponent', () => {
  let component: AddSnippetComponent;
  let fixture: ComponentFixture<AddSnippetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSnippetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSnippetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyViewExpensesComponent } from './my-view-expenses.component';

describe('MyViewExpensesComponent', () => {
  let component: MyViewExpensesComponent;
  let fixture: ComponentFixture<MyViewExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyViewExpensesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyViewExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

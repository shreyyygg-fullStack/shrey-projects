import { effect, Injectable, Injector, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  constructor(private injector: Injector) {  

    effect(() => {
    // console.log(`The state is: ${this.booleanState()}`);
  }, {injector: this.injector});

}

  // private booleanState = new BehaviorSubject<boolean>(false);
  booleanState = signal(false);

  guideFlag:boolean = false;
  guideOn = signal(false);

 
  // currentBooleanState = this.booleanState.asObservable();

  // changeBooleanState(state: boolean) {
  //   this.booleanState.next(state);
  // }
}


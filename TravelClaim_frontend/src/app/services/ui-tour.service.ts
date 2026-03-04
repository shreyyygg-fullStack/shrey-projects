import { Injectable } from '@angular/core';
import introJs from 'intro.js';

@Injectable({
  providedIn: 'root'
})
export class UiTourService {

  private intro = introJs();
  constructor() {
    this.intro.setOptions({
  showStepNumbers: true,
  showBullets: false,
  exitOnOverlayClick: false,
  showButtons: true,
  nextLabel: 'Next',
  prevLabel: 'Previous',
  doneLabel: 'End Tour',
  hidePrev: false,
  hideNext: false,
  steps: []
});

    
  }


  startTour(steps: any[]) {
    this.intro.setOptions({ steps });
      this.intro.start(); // Start the tour
    // this.intro.setOption("dontShowAgain", true).start();
  }
}

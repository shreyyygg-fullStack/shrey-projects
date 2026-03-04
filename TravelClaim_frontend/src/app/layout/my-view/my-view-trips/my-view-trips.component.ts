import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-my-view-trips',
  standalone: true,
  imports: [NgIf],
  templateUrl: './my-view-trips.component.html',
  styleUrl: './my-view-trips.component.scss'
})
export class MyViewTripsComponent {



  @Input() showModal: boolean = false;
  @Input() modalTitle: string = 'Modal Title';
  @Output() modalClosed = new EventEmitter<void>();


  closeModal(): void {
    this.showModal = false;
    this.modalClosed.emit();
  }


}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {
  visible = false;
  message = '';

  show(msg: string) {
    this.message = msg;
    this.visible = true;

    setTimeout(() => {
      this.visible = false;
    }, 3000);
  }
}

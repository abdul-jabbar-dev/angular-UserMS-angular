import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-static',
  templateUrl: './dialog-static.component.html',
  styleUrls: ['./dialog-static.component.css'],
})
export class DialogStaticComponent {
  title: string = '';
  desc: string = '';
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.title = data.title; // 'Value 1'
    this.desc = data.desc; // 'Value 2'
  }
}

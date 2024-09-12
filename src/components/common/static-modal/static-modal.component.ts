import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-static-modal',
  templateUrl: './static-modal.component.html',
  styleUrls: ['./static-modal.component.css'],
})
export class StaticModalComponent implements OnChanges {
  @Input() msg: string | null = '';

  ngOnChanges() {
    console.log(this.msg);
  }

  closeModal() {
    this.msg = null;
  }

  ngOnInit() {
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy() {
    document.body.style.overflow = '';
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit-my-products',
  templateUrl: './edit-my-products.component.html',
  styleUrls: ['./edit-my-products.component.css'],
})
export class EditMyProductsComponent implements OnInit {
  @Input() item: any;
  isEditable = false;

  productEdit = new FormGroup({
    title: new FormControl<string>(''),
    desc: new FormControl<string>(''),
    price: new FormControl<number>(0),
    image: new FormControl<string>(''),
  });

  ngOnInit() {
    console.log(this.item);
  }
  IsEditable() {
    this.isEditable = !this.isEditable;
    console.log(this.isEditable);
  }
}

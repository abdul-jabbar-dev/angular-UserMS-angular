import { Component } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Router } from '@angular/router';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-hero-branding',
  templateUrl: './hero-branding.component.html',
  styleUrls: ['./hero-branding.component.css'],
})
export class HeroBrandingComponent {
  toGo() {
    this.location.navigateByUrl('/create_products');
  }
  constructor(public location: Router) {}
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  fruits = [{ name: 'Lemon' }, { name: 'Lime' }, { name: 'Apple' }];

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.fruits.push({ name: value });
    }
    event.chipInput!.clear();
  }

  remove(fruit: any): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  edit(fruit: any, event: MatChipEditedEvent) {
    const value = event.value.trim();

    if (!value) {
      this.remove(fruit);
      return;
    }

    const index = this.fruits.indexOf(fruit);
    if (index >= 0) {
      this.fruits[index].name = value;
    }
  }
}

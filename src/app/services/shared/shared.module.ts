import { EventEmitter, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [],
  imports: [CommonModule],
})
export class SharedModule {
   static searchValueChange: EventEmitter<string> =
    new EventEmitter<string>();

  static setSearchValue(value: any) {
    this.searchValueChange.emit(value);
     
  }

  
}

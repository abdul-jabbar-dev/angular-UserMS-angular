import {
  Component,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-filter-select-button',
  templateUrl: './filter-select-button.component.html',
  styleUrls: ['./filter-select-button.component.css'],
})
export class FilterSelectButtonComponent {
  @Input() productGroup: { available?: number; hide?: number; sold?: number } =
    {
      available: 0,
      hide: 0,
      sold: 0,
    };

  
  @Output() inputFil = new BehaviorSubject<string[]>([]);
  @Input() allMyProducts: Record<string, any>[] = [];

  addOrRemove(e: any) {
    const currentFilters = this.inputFil.value;
    const value = e.target.value;

    if (currentFilters.includes(value)) {
      const updatedFilters = currentFilters.filter((item) => item !== value);
      this.inputFil.next(updatedFilters);
    } else {
      const updatedFilters = [...currentFilters, value];
      this.inputFil.next(updatedFilters);
    }
  }
}

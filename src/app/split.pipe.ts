import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'split',
})
export class SplitPipe implements PipeTransform {
  transform(value: string, separator: string, index?: number): string {
    if (!value) return value;
    const parts = value.split(separator);
    
    if (index) {
      return parts[index] || '';
    } else {
      return parts.join(' ') || '';
    }
  }
}

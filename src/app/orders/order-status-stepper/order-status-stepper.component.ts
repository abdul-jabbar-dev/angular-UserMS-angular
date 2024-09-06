import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'app-order-status-stepper',
  templateUrl: './order-status-stepper.component.html',
  styleUrls: ['./order-status-stepper.component.css'],
})
export class OrderStatusStepperComponent implements OnInit {
  @Input() order: any;
  currentStep: number | undefined = 0;

  steps: any[] = ['Viewing', 'packaging', 'transit', 'delivery', null];
  completedSteps: boolean[] = [true, true, true, true];

  ngOnInit(): void {
    const { delivery_status, order_status } = this.order;
    if (order_status === 'paid') {
      if (!delivery_status) {
        this.setCurrentStep('paid');
      } else if (delivery_status === 'packaging') {
        this.setCurrentStep('packaging');
      } else if (delivery_status === 'transit') {
        this.setCurrentStep('transit');
      } else if (delivery_status === 'delivery') {
        this.setCurrentStep('delivery');
      }
    } else {
      this.setCurrentStep('unpaid');
    }
    this.updateCompletedSteps(this.currentStep || 0);
  }

  setCurrentStep(orderStatus: string): void {
    this.steps = ['Viewing', 'packaging', 'transit', 'delivery', null];
    switch (orderStatus) {
      case 'paid':
        this.currentStep = 1;
        break;
      case 'unpaid':
        this.steps[0] = 'unpaid';
        this.currentStep = 0;
        break;
      case 'packaging':
        this.currentStep = 2;
        break;
      case 'transit':
        this.currentStep = 3;
        break;
      case 'delivery':
        this.currentStep = 4;
        break;
      default:
        this.currentStep = 0;
    }
  }
  updateCompletedSteps(currentStep: number): void {
    this.completedSteps = this.completedSteps.map(
      (_, index) => index <= currentStep
    );
  }
}

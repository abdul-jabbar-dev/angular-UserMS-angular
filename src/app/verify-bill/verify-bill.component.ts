import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { RequestService } from 'src/app/services/request.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import { format } from 'date-fns';

@Component({
  selector: 'app-verify-bill',
  templateUrl: './verify-bill.component.html',
  styleUrls: ['./verify-bill.component.css'],
})
export class VerifyBillComponent implements OnInit {
  order: any;
  orderId: string | null = null;

  myAngularxQrCode: string | undefined = undefined;

  rootUrl: string;

  constructor(
    private route: ActivatedRoute,
    protected request: RequestService
  ) {
    this.rootUrl = window.location.origin;
  }
  @ViewChild('content', { static: false }) content!: ElementRef;

  downloadPDF() {
    const data = this.content.nativeElement;

    html2canvas(data, { scale: 2 }).then((canvas) => {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(this.order.title);
    });
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.orderId = params.get('id');
      if (this.orderId) {
        this.loadOrder(this.orderId);
        this.myAngularxQrCode = this.rootUrl + '/verify/' + this.orderId;
      }
    });
  }

  printOrder() {
    const printContents = this.content.nativeElement.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    location.reload();
  }

  getDay(dateString: string): string {
    const result = format(new Date(dateString), 'dd-MM-yyyy');
    return result;
  }

  calculateTax(price: number): number {
    const taxRate = 0.02;
    return price * taxRate;
  }
  calculateSavings(total: number): number {
    if (!this.order) return 0;

    if (this.order.discount_type === 'fixed') {
      return Math.min(Number(this.order.discount_amount), total);
    } else if (this.order.discount_type === 'percentage') {
      return (total * Number(this.order.discount_amount)) / 100;
    }

    return 0;
  }
  calculateTotal(price: number, tax: number, shippingCost: number): number {
    let total = Number(price) + Number(tax) + Number(shippingCost);

    if (this.order && this.order.discount_type && this.order.discount_amount) {
      if (this.order.discount_type === 'fixed') {
        total -= Number(this.order.discount_amount);
      } else if (this.order.discount_type === 'percentage') {
        total -= (total * Number(this.order.discount_amount)) / 100;
      }
    }

    return Math.ceil(total);
  }
  async loadOrder(id: string) {
    try {
      const res = await firstValueFrom(
        await this.request.get('/shipping/' + this.orderId)
      );
      console.log(res);
      this.order = res;
    } catch (error) {
      console.log(error);
    }
  }
}

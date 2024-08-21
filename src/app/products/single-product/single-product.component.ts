import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { RequestService } from 'src/app/services/request.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.css'],
})
export class SingleProductComponent implements OnInit, OnDestroy {
  paramValue: string | null = null;
  product: {
    price: number;
    id: string;
    user_id: string;
    title: string;
    desc: null | string;
    image: string;
    created_at: Date;
  } | null = null;
  currentPath: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public request: RequestService
  ) {}

  ngOnInit(): void {
    this.updateCurrentPath();

    this.route.paramMap.subscribe((params) => {
      this.paramValue = params.get('id');
      this.getProducts();
    });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateCurrentPath();
      });
  }

  updateCurrentPath(): void {
    this.currentPath = this.router.url.split('/').filter((i) => i !== '');
  }

  getDay(dateString: any): string {
    const date = new Date(dateString);
    return date.toDateString();
  }

  async getProducts(): Promise<void> {
    if (!this.paramValue) {
      console.error('No product ID found');
      return;
    }

    try {
      this.product = await firstValueFrom(
        await this.request.get('/product/get_product/' + this.paramValue)
      );
    } catch (error) {
      console.error('Failed to fetch product:', error);
    }
  } 

  ngOnDestroy(): void {
    this.paramValue = null;
    this.product = null;
    this.currentPath = [];
  }
}

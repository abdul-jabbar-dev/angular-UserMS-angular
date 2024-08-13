import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'server/src/auth/auth.service';
import { RequestService } from 'src/app/services/request.service';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-create-products',
  templateUrl: './create-products.component.html',
  styleUrls: ['./create-products.component.css'],
})
export class CreateProductsComponent {
  selectedImg: { url: string; name: string; file: File | null } = {
    url: '',
    name: '',
    file: null,
  };
  isCreateing: boolean = false;

  constructor(
    public supabase: SupabaseService,
    public request: RequestService,
    public auth:AuthService
  ) {}

  createProductForm = new FormGroup({
    title: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    price: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(/^\d+(\.\d{1,2})?$/),
    ]),
    desc: new FormControl<string>(''),
    image: new FormControl<string>('', [Validators.required]),
  });

  distroSelectImg() {
    this.selectedImg = { url: '', name: '', file: null };
    this.createProductForm.patchValue({ image: null });
    this.createProductForm.get('image')?.updateValueAndValidity();
  }

  imageSubmit(event: any) {
    const file = event.target.files[0];
    console.log(file);
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        this.selectedImg.url = reader.result as string;
        this.selectedImg.file = file;

        // Trigger change detection manually
        this.createProductForm.patchValue({ image: file.name });
        this.createProductForm.get('image')?.updateValueAndValidity();
      };

      reader.readAsDataURL(file);
    }

    this.selectedImg.name = file?.name || '';
  }

  async onSubmit() {
    this.isCreateing = true;

    if (this.createProductForm.valid) {
      const data = await this.supabase.uploadAvatar(
        'products/' + this.selectedImg.name,
        this.selectedImg.file as File
      );

      if (data) {
        this.createProductForm.patchValue({
          image: (data as any).data.fullPath,
        });
// const id = await this.auth.
        const result = await firstValueFrom(
          await this.request.create(
            '/product/create',
            this.createProductForm.getRawValue()
          )
        );


        if (result?.error) {
          this.isCreateing = false;
        } else { 
          this.isCreateing = false;
        }
        this.createProductForm.reset();
        this.selectedImg = { file: null, name: '', url: '' };
      }
    } else {
      this.createProductForm.markAllAsTouched();
    }
    this.isCreateing = false;
  }
}

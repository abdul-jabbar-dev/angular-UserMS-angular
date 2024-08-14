import { firstValueFrom } from 'rxjs';
import { RequestService } from 'src/app/services/request.service';
import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-create-products',
  templateUrl: './create-products.component.html',
  styleUrls: ['./create-products.component.css'],
})
export class CreateProductsComponent {
  isError = '';
  selectedImg: { url: string; name: string; file: File | null } = {
    url: '',
    name: '',
    file: null,
  };
  isCreateing: boolean = false;
  constructor(
    public supabase: SupabaseService,
    public request: RequestService
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
  }
  imageSubmit(event: any) {
    const file = event.target.files[0];
    this.createProductForm.patchValue({
      image: file.name,
    });
    this.createProductForm.get('image')?.updateValueAndValidity();
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        this.selectedImg.url = reader.result as string;
        this.selectedImg.file = file;
      };

      this.selectedImg.name = file?.name;

      reader.readAsDataURL(file);
    }
  }
  async onSubmit() {
    this.isCreateing = true;
    try {
      this.isError = '';
      if (this.createProductForm.valid) {
        const data = await this.supabase.uploadAvatar(
          'products/' + this.selectedImg.name,
          this.selectedImg.file as File
        );
        if (data) {
          this.createProductForm.patchValue({
            image: (data as any).data.fullPath,
          });
          const result = await firstValueFrom(
            await this.request.create(
              '/product/create',
              this.createProductForm.getRawValue()
            )
          );

          // const result = await this.supabase.insertData(
          // 'Products',
          // this.createProductForm.getRawValue()
          // );

          if (result?.error) {
            console.log(result?.error);
            this.isCreateing = false;
          } else {
            console.log(result);
            this.isCreateing = false;
          }
          this.createProductForm.reset();
          this.selectedImg = { file: null, name: '', url: '' };
        }
      } else {
        this.createProductForm.markAllAsTouched();
      }
      this.isCreateing = false;
    } catch (error) {
      console.log(error);
      this.isCreateing = false;
      if (typeof error === 'string') {
        this.isError = error;
      } else if ((error as any).error) {
        this.isError = (error as any).error.message;
      } else {
        this.isError = (error as any).message;
      }
      setTimeout(() => {
        this.isError = '';
      }, 5000);
    }
  }
  OnDestroy() {
    this.createProductForm.reset();
    this.isCreateing = false;
    this.isError = '';
    this.selectedImg = {
      url: '',
      name: '',
      file: null,
    };
  }
}

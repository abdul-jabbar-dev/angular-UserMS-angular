import { firstValueFrom } from 'rxjs';
import { RequestService } from 'src/app/services/request.service';
import { ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SupabaseService } from 'src/app/services/supabase.service';
import {
  ClassicEditor,
  AutoLink,
  Autosave,
  BalloonToolbar,
  Bold,
  Heading,
  Italic,
  Link,
  Paragraph,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  Undo,
  type EditorConfig,
} from 'ckeditor5';
@Component({
  selector: 'app-create-products',
  templateUrl: './create-products.component.html',
  styleUrls: ['./create-products.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CreateProductsComponent {
  public form!: FormGroup;

  public isLayoutReady = false;
  public Editor = ClassicEditor;
  public config: EditorConfig = {};
  public ngAfterViewInit(): void {
    this.config = {
      toolbar: {
        items: [
          'undo',
          'redo',
          '|',
          'heading',
          '|',
          'bold',
          'italic',
          'code',
          '|',
          'link',
          'insertTable',
        ],
        shouldNotGroupWhenFull: false,
      },
      plugins: [
        AutoLink,
        Autosave,
        BalloonToolbar,
        Bold,
        Heading,
        Italic,
        Link,
        Paragraph,
        Table,
        TableCaption,
        TableCellProperties,
        TableColumnResize,
        TableProperties,
        TableToolbar,
        Undo,
      ],
      balloonToolbar: ['bold', 'italic', '|', 'link'],
      heading: {
        options: [
          {
            model: 'paragraph',
            title: 'Paragraph',
            class: 'ck-heading_paragraph',
          },
          {
            model: 'heading1',
            view: 'h1',
            title: 'Heading 1',
            class: 'ck-heading_heading1',
          },
          {
            model: 'heading2',
            view: 'h2',
            title: 'Heading 2',
            class: 'ck-heading_heading2',
          },
          {
            model: 'heading3',
            view: 'h3',
            title: 'Heading 3',
            class: 'ck-heading_heading3',
          },
          {
            model: 'heading4',
            view: 'h4',
            title: 'Heading 4',
            class: 'ck-heading_heading4',
          },
          {
            model: 'heading5',
            view: 'h5',
            title: 'Heading 5',
            class: 'ck-heading_heading5',
          },
          {
            model: 'heading6',
            view: 'h6',
            title: 'Heading 6',
            class: 'ck-heading_heading6',
          },
        ],
      },
      initialData: '',
      link: {
        addTargetToExternalLinks: true,
        defaultProtocol: 'https://',
      },
      placeholder: 'Product Description',
    };

    this.isLayoutReady = true;
    this.changeDetector.detectChanges();
  }

  public editorConfig = {
    toolbar: ['heading', '|', 'bold', 'italic', 'link'],
  };
  isError = '';
  selectedImg: { url: string; name: string; file: File | null } = {
    url: '',
    name: '',
    file: null,
  };
  isCreateing: boolean = false;
  constructor(
    public supabase: SupabaseService,
    public request: RequestService,
    private changeDetector: ChangeDetectorRef
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
    } catch (error) { 
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

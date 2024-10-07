import { SupabaseService } from './../../services/supabase.service';
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
import {
  Component,
  Input,
  OnInit,
  OnChanges,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectorRef,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { RequestService } from 'src/app/services/request.service';

@Component({
  selector: 'app-edit-my-products',
  templateUrl: './edit-my-products.component.html',
  styleUrls: ['./edit-my-products.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class EditMyProductsComponent implements OnInit, OnChanges {
  constructor(
    public supabase: SupabaseService,
    public request: RequestService,
    private changeDetector: ChangeDetectorRef
  ) {}
  @Input() item: any;
  @Output() updatedProduct = new EventEmitter<any>();
  isEditable = false;
  isUpdating = false;
  isSuccess = false;
  isError = '';
  selectedImage = {
    url: '',
    name: '',
    file: null,
  };

  productEdit = new FormGroup({
    title: new FormControl<string>('', [
      Validators.maxLength(3),
      Validators.required,
    ]),
    desc: new FormControl<string>(''),
    price: new FormControl<number>(0, [
      Validators.required,
      Validators.pattern(/^\d+(\.\d{1,2})?$/),
    ]),
    image: new FormControl<string>('', Validators.required),
    status: new FormControl<string>('', Validators.required),
  });
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

  setDefaultValue() {
    if (this.item) {
      this.productEdit.patchValue({
        title: this.item.title,
        desc: this.item.desc,
        price: this.item.price,
        image: this.item.image,
        status: this.item.status,
      });
    }
  }

  IsEditable() {
    this.isEditable = !this.isEditable;
  }

  async update() {
    this.isUpdating = true;
    if (this.selectedImage.file) {
      const data = await this.supabase.uploadAvatar(
        'products/' + this.selectedImage.name,
        this.selectedImage.file as File
      );
      console.log(data);
      await this.supabase.deleteAvatar(this.item.image);
      if (data) {
        this.productEdit.patchValue({
          image: (data as any).data.fullPath,
        });
      }
    }
    //update product
    const updatedResult = await firstValueFrom(
      await this.request.put(
        '/product/update/' + this.item.id,
        this.productEdit.getRawValue()
      )
    );
    this.isSuccess = true;
    if (updatedResult) {
      this.updatedProduct.emit(updatedResult);
    }

    this.isUpdating = false;
    this.isEditable = false;
    setTimeout(() => {
      this.isSuccess = false;
    }, 3000);
  }

  closeUpdate() {
    this.isEditable = false;
  }

  //add media
  addImage(event: any) {
    const file = event.target?.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        this.selectedImage.url = reader.result as string;
        this.selectedImage.name = file?.name;
        this.selectedImage.file = file;
      };

      reader.readAsDataURL(file);
    }
  }
  removePrevImg() {
    this.selectedImage.url = '';
    this.selectedImage.name = '';
    this.selectedImage.file = null;
  }
  ngOnInit() {
    this.setDefaultValue();
  }
  ngOnChanges(c: any) { 
    this.setDefaultValue();
  }

  OnDestroy() {
    this.productEdit.reset();
    this.isUpdating = false;
    this.isError = '';
    this.isSuccess = false;
    this.selectedImage = {
      url: '',
      name: '',
      file: null,
    };
  }
}

import {CommonModule, NgOptimizedImage} from '@angular/common';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {CategoriesService} from '../../services/categories.service';
import {AngularEditorModule} from '@kolkov/angular-editor';
import {HttpClientModule} from '@angular/common/http';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    AngularEditorModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgOptimizedImage,
  ],
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.css',
})
export class NewPostComponent implements OnInit, OnDestroy {
  link: string = '';
  imageSource: string = './assets/placeholder-image.jpeg';
  selectedImage: File | null = null;
  categories: { id: string; data: { category: string } }[] = [];
  postForm: FormGroup;

  private dataCategories: Subscription | null = null;

  constructor(
    private categoryService: CategoriesService,
    private formBuilder: FormBuilder
  ) {
    this.postForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(10)]],
      link: [{value: '', disabled: true}, Validators.required],
      details: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      selectedImage: ['', Validators.required],
      content: ['', Validators.required],
    });
  }

  get formControl() {
    return this.postForm.controls;
  }

  ngOnInit(): void {
    this.dataCategories = this.categoryService.loadData().subscribe((data) => {
      this.categories = data;
    });
  }

  onTitleChange($event: Event) {
    const title = ($event.target as HTMLInputElement).value;
    let link = title.replace(/\s/g, '-').toLowerCase();
    this.formControl['link'].setValue(link);
    console.log(this.postForm);
  }

  showPreview($event: Event) {
    const reader = new FileReader();
    reader.onload = (event) => {
      this.imageSource = event.target?.result as string;
    };
    const inputElement = $event.target as HTMLInputElement;
    if (inputElement?.files) {
      reader.readAsDataURL(inputElement?.files[0]);
      this.selectedImage = inputElement?.files[0];
    }
  }

  ngOnDestroy(): void {
    this.dataCategories?.unsubscribe();
  }
}

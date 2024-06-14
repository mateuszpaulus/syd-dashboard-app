import { Category } from './../../models/category';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CategoriesService } from '../../services/categories.service';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Post } from '../../models/post';
import { PostsService } from '../../services/posts.service';

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
  imageSource: string = './assets/placeholder-image.jpeg';
  selectedImage: File | null = null;
  categories: { id: string; data: { category: string } }[] = [];
  postForm: FormGroup;
  formStatus: string = 'Add new';
  docId: string = '';

  private dataCategories: Subscription | null = null;
  private postData: Subscription | null = null;

  constructor(
    private categoryService: CategoriesService,
    private formBuilder: FormBuilder,
    private postService: PostsService,
    private route: ActivatedRoute
  ) {
    this.postForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(10)]],
      link: [{ value: '', disabled: true }, Validators.required],
      details: ['', [Validators.required, Validators.minLength(10)]],
      category: [null, Validators.required],
      image: ['', Validators.required],
      content: ['', Validators.required],
    });

    this.postData = this.route.queryParams.subscribe((val) => {
      this.docId = val['id'];
      if (!this.docId) return;
      this.postService.loadSingleData(val['id']).subscribe((post) => {
        this.postForm = this.formBuilder.group({
          title: [
            post.data.title,
            [Validators.required, Validators.minLength(10)],
          ],
          link: [
            { value: post.data.title, disabled: true },
            Validators.required,
          ],
          details: [
            post.data.details,
            [Validators.required, Validators.minLength(10)],
          ],
          category: [
            {
              id: post.data.category.categoryId,
              data: { category: post.data.category.category },
            },
            Validators.required,
          ],
          image: ['', Validators.required],

          content: [post.data.content, Validators.required],
        });
        this.imageSource = post.data.imageUrl;
        this.formStatus = 'Edit';
      });
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
  compareCategories(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  onTitleChange($event: Event) {
    const title = ($event.target as HTMLInputElement).value;
    let link = title.replace(/\s/g, '-').toLowerCase();
    this.formControl['link'].setValue(link);
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

  onSubmit() {
    const postData: Post = {
      title: this.postForm.value.title,
      link: this.postForm.controls['link'].value,
      details: this.postForm.value.details,
      category: {
        categoryId: this.postForm.value.category.id,
        category: this.postForm.value.category.data.category,
      },
      imageUrl: '',
      content: this.postForm.value.content,
      isFeatured: false,
      views: 0,
      status: 'new',
      createdAt: new Date(),
    };

    this.postService.uploadImage(
      this.selectedImage,
      postData,
      this.formStatus,
      this.docId
    );
    this.postForm.reset();
    this.imageSource = './assets/placeholder-image.jpeg';
  }

  ngOnDestroy(): void {
    this.dataCategories?.unsubscribe();
    this.postData?.unsubscribe();
  }
}

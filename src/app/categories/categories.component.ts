import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoriesService } from '../services/categories.service';
import { Categories, Category } from '../models/category';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit, OnDestroy {
  categories: Categories[] = [];
  editCategory: Category = { category: '' };
  formStatus: string = 'Add';
  categoryId: string = '';

  private dataCategories: Subscription | null = null;

  constructor(private categoryService: CategoriesService) {}

  ngOnInit(): void {
    this.dataCategories = this.categoryService.loadData().subscribe((data) => {
      this.categories = data;
    });
  }

  onSubmit(form: NgForm) {
    let docCategoryDetails: Category = {
      category: form.value.category,
    };
    if (this.formStatus === 'Add') {
      this.categoryService.saveData(docCategoryDetails);
      form.reset();
    } else if (this.formStatus === 'Edit') {
      this.categoryService.updateData(this.categoryId, this.editCategory);
      form.reset();
      this.formStatus = 'Add';
    }
  }

  onEdit(editCategory: Category, id: string) {
    this.editCategory = editCategory;
    this.categoryId = id;
    this.formStatus = 'Edit';
  }

  onDelete(id: string) {
    this.categoryService.deleteData(id);
  }

  ngOnDestroy(): void {
    this.dataCategories?.unsubscribe();
  }
}

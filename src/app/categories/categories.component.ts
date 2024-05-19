import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../models/category';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  categories: { id: string; data: { category: string } }[] = [];
  editCategory: { category: string } = { category: '' };
  formStatus: string = 'Add';
  categoryId: string = '';

  constructor(private categoryService: CategoriesService) {}

  ngOnInit(): void {
    this.categoryService.loadData().subscribe((data) => {
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

  onEdit(editCategory: { category: string }, id: string) {
    this.editCategory = editCategory;
    this.categoryId = id;
    this.formStatus = 'Edit';
  }

  onDelete(id: string) {
    this.categoryService.deleteData(id);
  }
}

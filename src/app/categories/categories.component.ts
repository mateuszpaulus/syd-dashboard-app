import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [FormsModule],
  providers: [],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent {
  onSubmit(form: NgForm) {
    let docCategoryDetails = {
      category: form.value.category,
    };
    console.log(docCategoryDetails);
  }
}

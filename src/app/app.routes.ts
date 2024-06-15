import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CategoriesComponent } from './categories/categories.component';
import { NewPostComponent } from './posts/new-post/new-post.component';
import { AllPostsComponent } from './posts/all-posts/all-posts.component';
import { LoginComponent } from './auth/login/login.component';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  {
    path: 'categories',
    component: CategoriesComponent,
    canActivate: [authGuard],
  },
  { path: 'posts', component: AllPostsComponent, canActivate: [authGuard] },
  { path: 'posts/new', component: NewPostComponent, canActivate: [authGuard] },
];

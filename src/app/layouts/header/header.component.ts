import { Observable } from 'rxjs';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  userEmail: string = '';
  isLoggedIn$: Observable<boolean> = new Observable();
  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    if (localStorage.getItem('user')) {
      this.userEmail = JSON.parse(localStorage.getItem('user') ?? '')?.email;
    }
    this.isLoggedIn$ = this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
  }
}

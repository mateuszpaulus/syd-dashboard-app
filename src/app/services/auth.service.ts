import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoggedInGuard: boolean = false;

  constructor(
    private auth: Auth,
    private toastr: ToastrService,
    private router: Router
  ) {}

  login(email: string, password: string) {
    signInWithEmailAndPassword(this.auth, email, password)
      .then(() => {
        this.toastr.success('Logged In Successfully');
        this.loadUser();
        this.loggedIn.next(true);
        this.isLoggedInGuard = true;
        this.router.navigate(['/']);
      })
      .catch((e) => {
        this.toastr.warning(e, 'Login Failed');
      });
  }

  loadUser() {
    this.auth.onAuthStateChanged((user) => {
      localStorage.setItem('user', JSON.stringify(user));
    });
  }

  logout() {
    this.auth.signOut().then(() => {
      localStorage.removeItem('user');
      this.toastr.success('Logged Out Successfully');
      this.loggedIn.next(false);
      this.isLoggedInGuard = false;
      this.router.navigate(['/login']);
    });
  }

  isLoggedIn() {
    return this.loggedIn.asObservable();
  }
}

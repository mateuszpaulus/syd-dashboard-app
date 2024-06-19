import {inject, Injectable} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from './auth.service';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
class PermissionsService {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toaster: ToastrService
  ) {
  }

  isAuthenticated(): boolean {
    return this.authService.isLoggedInGuard;
  }

  useRouter() {
    return this.router.navigate(['/login']);
  }

  useToaster() {
    return this.toaster.warning("You don't have permission");
  }
}

export const authGuard: CanActivateFn = () => {
  const permissionsService = inject(PermissionsService);
  if (permissionsService.isAuthenticated()) {
    return permissionsService.isAuthenticated();
  }
  permissionsService.useRouter();
  permissionsService.useToaster();
  return false;
};


import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthenticationService } from '../../services/login/authentication.service';
import { LocalStorageService } from '../../services/localStorage/local-storage.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _authenticationService: AuthenticationService,
    private _localStorageService: LocalStorageService,
    private router: Router,
    private _snackbar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      console.log('Login with:', email, password);
      this._authenticationService.login(email, password).subscribe({
        next: (response: any) => {
          console.log('Login successful:', response);
          this._localStorageService.setToken('token', response.token);
          this._localStorageService.setLocalStorageItem(
            'email',
            response.user.email
          );
          this._localStorageService.setLocalStorageItem(
            'username',
            response.user.username
          );
          this._localStorageService.setRole(response.user.role.name);
          this._snackbar.open(`Welcome ${response.user.username}`, ' ', {
            duration: 3000,
            panelClass: ['snackbar-success'],
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
          setTimeout(() => {
            this.router.navigate(['/tasks']);
          }, 1000);
          // Handle successful login, e.g., navigate to another page
        },
        error: (error) => {
          console.error('Login failed:', error);
          this._snackbar.open('Login failed. Please try again.', 'Close', {
            duration: 3000,
          });
          // Handle login error, e.g., show an error message
        },
      });
    }
  }
}

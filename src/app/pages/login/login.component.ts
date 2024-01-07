import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {Router, RouterModule} from "@angular/router";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {AuthService} from "../../core/service/auth.service";
import {Account} from "../../core/model/account.interface";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule, RouterModule,
    MatSnackBarModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  isButtonLoading = false;

  constructor(private fb: FormBuilder, private snackbar: MatSnackBar, private authService: AuthService,
              private router: Router) {
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  handleClickLogin() {

  }

  login($event: MouseEvent) {

    //validate username and password inputs.
    if (this.loginForm.invalid) {
      this.isButtonLoading = true;
      setTimeout(() => {
        this.isButtonLoading = false;
        this.loginForm.markAllAsTouched();
        this.snackbar.open('Please fill in required field', 'Close', {duration: 1000});
      }, 2000);
      return;
    }

    //validate user authenticity/user account is exist or not.
    this.isButtonLoading = true;
    this.snackbar.open('Authenticating user.. Please wait..', 'Close', {duration: 2000});
    setTimeout(() => {
      this.isButtonLoading = false;
      this.authService.login({username: this.username?.getRawValue(), password: this.password?.getRawValue()})
        .subscribe({
          next: (res:Account) => {
            this.authService.setUserInfo(res);
            this.router.navigateByUrl('admin/dashboard')
              .then(res =>
                this.snackbar.open('Welcome back', 'Close', {duration: 1000})).then(window.location.reload);
          },
          error: err => {
            if (err.status === 401) {
              this.snackbar.open('Invalid username and password', 'Close', {duration: 1000});
            }
          }
        });
    }, 2000);
  }


}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    this.loading = true;
    this.authService
      .login(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe(
        (user) => {
          this.snackBar.open(
            `Login realizado com sucesso. Bem-vindo ${user.firstName}!`,
            'Ok',
            { duration: 2000 }
          );
          this.router.navigateByUrl('/');
          this.loading = false;
        },
        (err) => {
          this.snackBar.open(err, 'Ok', { duration: 2000 });
          this.loading = false;
        }
      );
  }

  loginGoogle() {
    this.loading = true;
    this.authService.loginGoogle()
    .subscribe((user) => {
      this.snackBar.open(
        `Login realizado com sucesso. Bem-vindo ${user.firstName}!`,
        'Ok',
        { duration: 2000 }
      );
      this.router.navigateByUrl('/');
      this.loading = false;
    },
    (err) => {
      this.snackBar.open(err, 'Ok', { duration: 2000 });
      this.loading = false;
    });
  }
}

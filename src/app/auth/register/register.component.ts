import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  formRegister: FormGroup = this.fb.group(
    {
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      address: ['', []],
      city: ['', []],
      state: ['', []],
      phone: ['', []],
      mobilePhone: ['', []],
      email: ['', [Validators.required, Validators.email]],
      password1: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', [Validators.required, Validators.minLength(6)]],
    },
    { validator: this.matchingPasswords }
  );

  states = ['MG', 'RS', 'SP', 'PR'];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {}

  matchingPasswords(group: FormGroup) {
    if (group) {
      const password1 = group.controls['password1'].value;
      const password2 = group.controls['password2'].value;
      if (password1 == password2) {
        return null;
      }
      return { matching: false };
    }
  }

  onSubmit() {
    const newUser: User = {
      firstName: this.formRegister.value.firstName,
      lastName: this.formRegister.value.lastName,
      address: this.formRegister.value.address,
      city: this.formRegister.value.city,
      state: this.formRegister.value.state,
      phone: this.formRegister.value.phone,
      mobilePhone: this.formRegister.value.mobilePhone,
      email: this.formRegister.value.email
    };

    this.authService.register(newUser).subscribe(
      (u) => {
        this.snackBar.open('Usuário criado com sucesso', 'Ok', {
          duration: 2000,
        });
        this.router.navigateByUrl('/auth/login');
      },
      (err) => {
        console.log(err);
        this.snackBar.open('Ocorreu um erro ao registar usuário', 'Ok', {
          duration: 2000,
        });
      }
    );
  }
}

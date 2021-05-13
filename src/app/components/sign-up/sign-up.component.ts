import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';
import {LoginDto} from '../../entities/user/login-dto';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit, OnDestroy {
  message: string;
  loading = false;
  submitted = false;
  error = '';
  subscription: Subscription;
  signUpForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthService
  ) {
    if (this.authenticationService.userValue) {
      this.router.navigate(['']);
    }
  }

  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      password: new FormControl('', [
        Validators.required]),
      passwordConfirm: new FormControl('', [
        Validators.required])
    });
  }

  onSubmit(): void {
    this.message = '';
    this.loading = true;
    if (this.password.value === this.passwordConfirm.value) {
      const user: LoginDto = new LoginDto(this.email.value, this.password.value);

      this.subscription = this.authenticationService.register(user)
        .pipe(first())
        .subscribe({
          next: () => {
            this.router.navigate(['login']);
            this.loading = false;
          },
          error: () => {
            this.error = 'Email or password is incorrect';
            this.loading = false;
          }
        });
    } else {
      this.message = 'Password in confirmation doesn\'t match';
      this.loading = false;
    }
  }

  get passwordConfirm(): any {
    return this.signUpForm.get('passwordConfirm');
  }

  get email(): any {
    return this.signUpForm.get('email');
  }

  get password(): any {
    return this.signUpForm.get('password');
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

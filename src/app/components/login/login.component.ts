import {Component, OnDestroy, OnInit} from '@angular/core';
import {LoginDto} from '../../entities/user/login-dto';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  message: string;
  loading = false;
  submitted = false;
  error = '';
  subscription: Subscription;
  loginForm: FormGroup;

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
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      password: new FormControl('', [Validators.required])
    });
  }

  onSubmit(): void {

    this.loading = true;
    const user: LoginDto = new LoginDto(this.email.value, this.password.value);

    this.subscription = this.authenticationService.login(user)
      .pipe(first())
      .subscribe({
        next: () => {
          this.router.navigate(['landing']);
          this.loading = false;
        },
        error: () => {
          this.error = 'Email or password is incorrect';
          this.loading = false;
        }
      });
  }

  get email(): any {
    return this.loginForm.get('email');
  }

  get password(): any {
    return this.loginForm.get('password');
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {ResetPasswordService} from '../../services/reset-password/reset-password.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-save-password',
  templateUrl: './save-password.component.html',
  styleUrls: ['./save-password.component.css']
})
export class SavePasswordComponent implements OnInit, OnDestroy {
  passwordForm: FormGroup;
  subscription: Subscription;
  loading = false;
  resetToken: string;
  message: string;

  constructor(
    private formBuilder: FormBuilder,
    private resetService: ResetPasswordService,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
          this.resetToken = params.token;
        }
      );
    this.passwordForm = this.formBuilder.group({
      password: new FormControl('', [
        Validators.required]),
      passwordConfirm: new FormControl('', [
        Validators.required])
    });
  }

  get password(): any {
    return this.passwordForm.get('password');
  }

  get passwordConfirm(): any {
    return this.passwordForm.get('passwordConfirm');
  }

  onSubmit(): void {
    this.message = '';
    this.loading = true;

    if (this.password.value === this.passwordConfirm.value) {
      this.subscription = this.resetService.sendResetTokenAndPassword(this.resetToken, this.password.value).subscribe(
        {
          next: data => {
            switch (data) {
              case 'message.resetPasswordSuc': {
                this.router.navigate(['/login']);
                break;
              }
              case 'reset.token.null': {
                this.message = 'Reset token doesn\'t exist';
                break;
              }
              case 'token.expired': {
                this.message = 'You have already changed the password';
                break;
              }
              case 'token.invalid': {
                this.message = 'This link is invalid';
                break;
              }
              case 'same.password': {
                this.message = 'Same password as before';
                break;
              }
              default: {
                this.message = 'Server error';
                break;
              }
            }
            this.loading = false;
          }
        });
    } else {
      this.message = 'Password in confirmation doesn\'t match';
      this.loading = false;
    }

  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

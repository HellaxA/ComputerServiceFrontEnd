import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {ResetPasswordService} from '../../services/reset-password/reset-password.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {

  emailForm: FormGroup;
  recoveryEmail: string;
  message: string;
  successMessage: string;
  isSent: boolean;
  loading = false;
  subscription: Subscription;


  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private resetPasswordService: ResetPasswordService) {
  }

  ngOnInit(): void {
    this.emailForm = this.formBuilder.group({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
    });
  }

  get email(): any {
    return this.emailForm.get('email');
  }

  onSubmit(): void {
    this.message = '';
    this.successMessage = '';
    this.loading = true;

    this.subscription = this.resetPasswordService.sendResetEmail({email : this.email.value}).subscribe(
      {
        next: data => {
          switch (data) {
            case 'user.fetched': {
              this.successMessage = 'Confirmation was sent to your email';
              break;
            }
            case 'invalid.email': {
              this.message = 'Invalid email';
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
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

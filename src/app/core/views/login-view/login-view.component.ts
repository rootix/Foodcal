import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Login } from 'src/app/shared/state/auth';

@Component({
    selector: 'fc-login-view',
    templateUrl: './login-view.component.html',
    styleUrls: ['./login-view.component.scss'],
})
export class LoginViewComponent {
    loading = false;
    loginFailed = false;

    readonly form = new FormGroup({
        username: new FormControl<string>('', { nonNullable: true, validators: [Validators.required]}),
        password: new FormControl<string>('', { nonNullable: true, validators: [Validators.required]}),
    });

    constructor(private store: Store, private router: Router) {}

    onLogin() {
        this.form.updateValueAndValidity();

        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        this.store.dispatch(new Login(this.form.controls.username.value, this.form.controls.password.value)).subscribe(
            (_) => this.router.navigate(['/schedule']),
            (_) => {
                this.loading = false;
                this.loginFailed = true;
            }
        );
    }

    onLoginFailedAlertClosed() {
        this.loginFailed = false;
    }
}

import { Component, DestroyRef } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Login } from 'src/app/shared/state/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NzCardComponent } from 'ng-zorro-antd/card';
import { NgIf } from '@angular/common';
import { NzAlertComponent } from 'ng-zorro-antd/alert';
import { NzFormDirective, NzFormItemComponent, NzFormLabelComponent, NzFormControlComponent } from 'ng-zorro-antd/form';
import { NzRowDirective, NzColDirective } from 'ng-zorro-antd/grid';
import { NzInputDirective } from 'ng-zorro-antd/input';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzWaveDirective } from 'ng-zorro-antd/core/wave';

@Component({
    selector: 'fc-login-view',
    templateUrl: './login-view.component.html',
    styleUrls: ['./login-view.component.scss'],
    imports: [
        NzCardComponent,
        NgIf,
        NzAlertComponent,
        ReactiveFormsModule,
        NzFormDirective,
        NzRowDirective,
        NzFormItemComponent,
        NzColDirective,
        NzFormLabelComponent,
        NzFormControlComponent,
        NzInputDirective,
        NzButtonComponent,
        NzWaveDirective,
    ],
})
export class LoginViewComponent {
    loading = false;
    loginFailed: false | string = false;

    readonly form = new FormGroup({
        username: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
        password: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    });

    constructor(
        private store: Store,
        private router: Router,
        private destroyRef: DestroyRef
    ) {}

    onLogin() {
        this.form.updateValueAndValidity();

        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        this.store
            .dispatch(new Login(this.form.controls.username.value, this.form.controls.password.value))
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(
                (_) => this.router.navigate(['/schedule']),
                (error) => {
                    this.loading = false;
                    this.loginFailed = error;
                }
            );
    }

    onLoginFailedAlertClosed() {
        this.loginFailed = false;
    }
}

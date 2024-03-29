import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ofActionSuccessful, Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthState, Logout } from 'src/app/shared/state/auth';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
    selector: 'fc-shell',
    templateUrl: './shell.component.html',
    styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit {
    @Select(AuthState.isAuthenticated) isAuthenticated$!: Observable<boolean>;

    constructor(
        private store: Store,
        private actions$: Actions,
        private authService: AuthService,
        private router: Router
    ) {}

    ngOnInit() {
        this.authService.handleSession();
        this.actions$.pipe(ofActionSuccessful(Logout)).subscribe((_) => this.router.navigate(['/login']));
    }

    onLogout() {
        this.store.dispatch(new Logout());
    }
}

import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Actions, ofActionSuccessful, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthState, Logout } from 'src/app/shared/state/auth';
import { AuthService } from '../../../shared/services/auth.service';
import { NzContentComponent, NzFooterComponent, NzLayoutComponent, NzSiderComponent } from 'ng-zorro-antd/layout';
import { AsyncPipe, NgIf } from '@angular/common';
import { NzMenuDirective, NzMenuItemComponent } from 'ng-zorro-antd/menu';
import { NzIconDirective } from 'ng-zorro-antd/icon';

@Component({
    selector: 'fc-shell',
    templateUrl: './shell.component.html',
    styleUrls: ['./shell.component.scss'],
    imports: [
        NzLayoutComponent,
        NzSiderComponent,
        RouterLink,
        NgIf,
        NzMenuDirective,
        NzMenuItemComponent,
        NzIconDirective,
        NzContentComponent,
        RouterOutlet,
        NzFooterComponent,
        AsyncPipe,
    ],
})
export class ShellComponent implements OnInit {
    isAuthenticated$: Observable<boolean> = this.store.select(AuthState.isAuthenticated);

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

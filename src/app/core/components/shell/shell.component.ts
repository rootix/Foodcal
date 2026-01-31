import { Component, OnInit, inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Actions, ofActionSuccessful, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthState, Logout } from 'src/app/shared/state/auth';
import { AuthService } from '../../../shared/services/auth.service';
import { NzContentComponent, NzFooterComponent, NzLayoutComponent, NzSiderComponent } from 'ng-zorro-antd/layout';
import { AsyncPipe } from '@angular/common';
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
    private store = inject(Store);
    private actions$ = inject(Actions);
    private authService = inject(AuthService);
    private router = inject(Router);
    private breakpointObserver = inject(BreakpointObserver);

    isAuthenticated$: Observable<boolean> = this.store.select(AuthState.isAuthenticated);
    siderCollapsed = false;
    private isMobile = false;

    ngOnInit() {
        this.authService.handleSession();
        this.actions$.pipe(ofActionSuccessful(Logout)).subscribe((_) => this.router.navigate(['/login']));
        this.breakpointObserver.observe('(max-width: 991px)').subscribe((result) => {
            this.isMobile = result.matches;
        });
    }

    onLogout() {
        this.store.dispatch(new Logout());
    }

    closeSliderIfMobile() {
        if (this.isMobile) {
            this.siderCollapsed = true;
        }
    }
}

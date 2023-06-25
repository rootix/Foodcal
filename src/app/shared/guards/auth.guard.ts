import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthState } from '../state/auth';
import { Store } from '@ngxs/store';

export const authGuard: CanActivateFn = () => {
    const store = inject(Store);
    const router = inject(Router);
    const isAuthenticated = store.selectSnapshot(AuthState.isAuthenticated);
    return isAuthenticated ? true : router.navigate(['/login']);
};

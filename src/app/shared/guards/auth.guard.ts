import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { SupabaseService } from '../services/supabase.service';
import { from } from 'rxjs';

export const authGuard: CanActivateFn = () => {
    const router = inject(Router);
    const supabaseService = inject(SupabaseService);

    /* This relies directly on the response from the Supabase service as the isAuthenticated selector of AuthState
       is behind in the guard timing. */
    return from(supabaseService.getClient().auth.getSession()).pipe(
        map((result) => (result.data.session ? true : router.parseUrl('/login')))
    );
};

import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { SupabaseService } from './supabase.service';
import { Store } from '@ngxs/store';
import { AuthChanged } from '../state/auth';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private subabaseService: SupabaseService, private store: Store) {}

    login(email: string, password: string) {
        return from(this.subabaseService.getClient().auth.signInWithPassword({ email, password }));
    }

    handleSession() {
        this.subabaseService.getClient().auth.onAuthStateChange((_, session) => {
            this.store.dispatch(new AuthChanged(session));
        });
    }

    logout() {
        return from(this.subabaseService.getClient().auth.signOut());
    }
}

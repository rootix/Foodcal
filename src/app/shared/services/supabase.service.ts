import { AuthTokenResponse, createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { Database } from '../../database.types';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
    private readonly supabase: SupabaseClient<Database>;

    constructor() {
        this.supabase = createClient<Database>(environment.supabaseUrl, environment.supabaseKey);
    }

    getClient() {
        return this.supabase;
    }

    async login(email: string, password: string): Promise<AuthTokenResponse> {
        return await this.supabase.auth.signInWithPassword({ email, password });
    }

    async logout(): Promise<void> {
        await this.supabase.auth.signOut();
    }
}

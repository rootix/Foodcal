import { Session } from '@supabase/supabase-js';

export class Login {
    static readonly type = '[Auth] Login';
    constructor(public email: string, public password: string) {}
}

export class AuthChanged {
    static readonly type = '[Auth] AuthChanged';
    constructor(public session: Session | null) {}
}

export class Logout {
    static readonly type = '[Auth] Logout';
}

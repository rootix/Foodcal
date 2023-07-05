import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { AuthChanged, Login, Logout } from './auth.actions';
import { Session } from '@supabase/supabase-js';

export interface AuthStateModel {
    user: Session | null;
}

@State<AuthStateModel>({
    name: 'auth',
    defaults: {
        user: null,
    },
})
@Injectable()
export class AuthState {
    constructor(private authService: AuthService) {}
    @Selector()
    static isAuthenticated(state: AuthStateModel) {
        return !!state.user;
    }

    @Action(Login)
    login(ctx: StateContext<AuthStateModel>, action: Login) {
        this.authService.login(action.email, action.password).pipe(
            tap((result) => console.log(result)),
            tap((result) => ctx.patchState({ user: result.data.session }))
        );
    }

    @Action(AuthChanged)
    authChanged(ctx: StateContext<AuthStateModel>, action: AuthChanged) {
        console.log('auth changed', action);
        ctx.patchState({ user: action.session });
    }

    @Action(Logout)
    logout(ctx: StateContext<AuthStateModel>) {
        this.authService.logout().pipe(tap((_) => ctx.setState({ user: null })));
    }
}

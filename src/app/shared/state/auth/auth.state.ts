import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { map, tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { AuthChanged, Login, Logout } from './auth.actions';
import { Session } from '@supabase/supabase-js';
import { EMPTY } from 'rxjs';

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
        return this.authService.login(action.email, action.password).pipe(
            tap((result) => {
                if (result.error) {
                    throw new Error(result.error.message);
                }
            }),
            tap((result) => ctx.patchState({ user: result.data.session })),
            map((_) => EMPTY)
        );
    }

    @Action(AuthChanged)
    authChanged(ctx: StateContext<AuthStateModel>, action: AuthChanged) {
        ctx.patchState({ user: action.session });
    }

    @Action(Logout)
    logout(ctx: StateContext<AuthStateModel>) {
        this.authService.logout().pipe(tap((_) => ctx.setState({ user: null })));
    }
}

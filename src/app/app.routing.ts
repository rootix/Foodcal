import { Routes } from '@angular/router';
import { LoginViewComponent } from './core/views/login-view/login-view.component';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginViewComponent },
    {
        path: 'schedule',
        loadChildren: () => import('./schedule/schedule.routing').then((m) => m.routes),
        canActivate: [authGuard],
    },
    {
        path: 'recipes',
        loadChildren: () => import('./recipes/recipes.routing').then((m) => m.routes),
        canActivate: [authGuard],
    },
    { path: '', redirectTo: 'schedule', pathMatch: 'full' },
];

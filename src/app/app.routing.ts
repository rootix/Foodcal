import { RouterModule, Routes } from '@angular/router';
import { LoginViewComponent } from './core/views/login-view/login-view.component';
import { SCHEDULE_ROUTES } from './schedule/schedule.routing';
import { authGuard } from './shared/guards/auth.guard';

const routes: Routes = [
    { path: 'login', component: LoginViewComponent },
    { path: 'schedule', children: SCHEDULE_ROUTES, canActivate: [authGuard] },
    {
        path: 'recipes',
        loadChildren: () => import('./recipes/recipes.module').then((m) => m.RecipesModule),
        canActivate: [authGuard],
    },
    { path: '', redirectTo: 'schedule', pathMatch: 'full' },
];

export const APP_ROUTES = RouterModule.forRoot(routes, {});

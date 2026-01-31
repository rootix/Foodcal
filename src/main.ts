import { enableProdMode, provideZoneChangeDetection } from '@angular/core';

import { environment } from './environments/environment';
import { de_DE, NZ_I18N } from 'ng-zorro-antd/i18n';
import localeDeCh from '@angular/common/locales/de-CH';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngxs/store';
import { AuthState } from './app/shared/state/auth';
import { RecipeState } from './app/shared/state/recipe';
import { withNgxsStoragePlugin } from '@ngxs/storage-plugin';
import { withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routing';
import { registerLocaleData } from '@angular/common';

if (environment.production) {
    enableProdMode();
}

registerLocaleData(localeDeCh, 'de-CH');
bootstrapApplication(AppComponent, {
    providers: [
        provideZoneChangeDetection(),
        provideRouter(routes),
        provideStore(
            [AuthState, RecipeState],
            { developmentMode: !environment.production, selectorOptions: { suppressErrors: true } },
            withNgxsStoragePlugin({ keys: ['auth.token'] }),
            withNgxsReduxDevtoolsPlugin()
        ),
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimations(),
        { provide: NZ_I18N, useValue: de_DE },
    ],
}).catch((err) => console.error(err));

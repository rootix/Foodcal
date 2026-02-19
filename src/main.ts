import { enableProdMode, LOCALE_ID, provideZonelessChangeDetection } from '@angular/core';

import { environment } from './environments/environment';
import { de_DE, NZ_DATE_CONFIG, NZ_I18N } from 'ng-zorro-antd/i18n';
import localeDe from '@angular/common/locales/de';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngxs/store';
import { AuthState } from './app/shared/state/auth';
import { DishState } from './app/shared/state/dish';
import { withNgxsStoragePlugin } from '@ngxs/storage-plugin';
import { withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routing';
import { registerLocaleData } from '@angular/common';

if (environment.production) {
    enableProdMode();
}

registerLocaleData(localeDe);

bootstrapApplication(AppComponent, {
    providers: [
        provideZonelessChangeDetection(),
        provideRouter(routes),
        provideStore(
            [AuthState, DishState],
            { developmentMode: !environment.production, selectorOptions: { suppressErrors: true } },
            withNgxsStoragePlugin({ keys: ['auth.token'] }),
            withNgxsReduxDevtoolsPlugin()
        ),
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimations(),
        { provide: NZ_I18N, useValue: de_DE },
        { provide: NZ_DATE_CONFIG, useValue: { firstDayOfWeek: 1 } },
        { provide: LOCALE_ID, useValue: 'de-CH' },
    ],
}).catch((err) => console.error(err));

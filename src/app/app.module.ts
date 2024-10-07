import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import de from '@angular/common/locales/de';
import '@angular/common/locales/global/de-CH';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
import { de_DE, NZ_I18N } from 'ng-zorro-antd/i18n';
import { environment } from 'src/environments/environment';
import { AppComponent } from './app.component';
import { APP_ROUTES } from './app.routing';
import { CoreModule } from './core/core.module';
import { ScheduleModule } from './schedule/schedule.module';
import { AuthState } from './shared/state/auth';
import { RecipeState } from './shared/state/recipe';

registerLocaleData(de);

@NgModule({ declarations: [AppComponent],
    bootstrap: [AppComponent], imports: [BrowserModule,
        APP_ROUTES,
        BrowserAnimationsModule,
        CoreModule,
        NgxsModule.forRoot([AuthState, RecipeState], {
            developmentMode: !environment.production,
            selectorOptions: { injectContainerState: false, suppressErrors: false },
        }),
        NgxsStoragePluginModule.forRoot({
            keys: ['auth.token'],
        }),
        ScheduleModule,
        NgxsReduxDevtoolsPluginModule.forRoot()], providers: [
        { provide: LOCALE_ID, useValue: 'de-CH' },
        { provide: NZ_I18N, useValue: de_DE },
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class AppModule {}

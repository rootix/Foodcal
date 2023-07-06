import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
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

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        HttpClientModule,
        APP_ROUTES,
        BrowserAnimationsModule,
        CoreModule,
        NgxsModule.forRoot([AuthState, RecipeState], {
            developmentMode: !environment.production,
            selectorOptions: { injectContainerState: false, suppressErrors: false },
        }),
        NgxsStoragePluginModule.forRoot({
            key: 'auth.token',
        }),
        ScheduleModule,
        NgxsReduxDevtoolsPluginModule.forRoot(),
    ],
    bootstrap: [AppComponent],
    providers: [
        { provide: LOCALE_ID, useValue: 'de-CH' },
        { provide: NZ_I18N, useValue: de_DE },
    ],
})
export class AppModule {}

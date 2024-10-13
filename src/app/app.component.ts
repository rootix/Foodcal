import { Component } from '@angular/core';
import { ShellComponent } from './core/components/shell/shell.component';

@Component({
    selector: 'fc-root',
    template: ` <fc-shell></fc-shell> `,
    standalone: true,
    imports: [ShellComponent],
})
export class AppComponent {}

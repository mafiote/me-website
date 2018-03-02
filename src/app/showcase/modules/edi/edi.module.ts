import { NgModule } from '@angular/core';
import { EDI_PROVIDERS } from './services/index';

@NgModule({
    imports: [],
    exports: [],
    declarations: [

    ],
    providers: [
        ...EDI_PROVIDERS
    ]
})
export class EdiModule { }

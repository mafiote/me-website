import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FullLayoutComponent } from '../full-layout.component';
declare var jQuery: any;

@Component({
    selector: 'app-rightpanel',
    templateUrl: './app.rightpanel.component.html'
})
export class AppRightPanelComponent implements AfterViewInit, OnDestroy {

    rightPanelMenuScroller: HTMLDivElement;

    @ViewChild('rightPanelMenuScroller') rightPanelMenuScrollerViewChild: ElementRef;

    constructor(public app: FullLayoutComponent) { }

    ngAfterViewInit() {
        this.rightPanelMenuScroller = <HTMLDivElement>this.rightPanelMenuScrollerViewChild.nativeElement;

        setTimeout(() => {
            jQuery(this.rightPanelMenuScroller).nanoScroller({ flash: true });
        }, 10);
    }

    ngOnDestroy() {
        jQuery(this.rightPanelMenuScroller).nanoScroller({ flash: true });
    }
}

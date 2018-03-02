
import { FullLayoutComponent } from './full-layout.component';
import { AppFooterComponent } from './footer/app.footer.component';
import { AppMenuComponent, AppSubMenuComponent } from './menu/app.menu.component';
import { InlineProfileComponent } from './profile/app.profile.component';
import { AppRightPanelComponent } from './right/app.rightpanel.component';
import { AppTopBarComponent } from './top/app.topbar.component';

export const FULL_LAYOUT_COMPONENTS: any[] = [
    FullLayoutComponent,
    AppFooterComponent,
    AppMenuComponent,
    AppSubMenuComponent,
    InlineProfileComponent,
    AppRightPanelComponent,
    AppTopBarComponent
];

export * from './full-layout.component';
export * from './footer/app.footer.component';
export * from './menu/app.menu.component';
export * from './profile/app.profile.component';
export * from './right/app.rightpanel.component';
export * from './top/app.topbar.component';
import { RsAttachmentComponent } from './components/attachment/rs-attachment.component';
import { RsAutoCompleteComponent } from './components/autocomplete/rs-autocomplete.component';
import { RsCalendarComponent } from './components/calendar/rs-calendar.componnet';
import { RsMultiSelectComponent } from './components/multiselect/rs-multiSelect.component';
import { RsFileService, RsHttpService } from './http/index';
import { RsHttpAutoCompleteService } from './http/rs-http-autocomplete.service';
import { StorageService } from './storage/storage.service';
import { IsDeletedFilterPipe } from './pipes/is-deleted-filter-pipe';
import { RsChartJsService } from './charts/index';


export const CORE_PROVIDERS: any[] = [
    StorageService,
    RsHttpService,
    RsHttpAutoCompleteService,
    RsFileService,
    RsChartJsService
];

export const CORE_COMPONENTS: any[] = [
    RsAutoCompleteComponent,
    RsCalendarComponent,
    RsMultiSelectComponent,
    RsAttachmentComponent,
    IsDeletedFilterPipe
];
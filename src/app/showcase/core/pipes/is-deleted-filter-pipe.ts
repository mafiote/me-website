import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'isDeletedFilter',
    pure: false
})
export class IsDeletedFilterPipe implements PipeTransform {
    transform(items: any[]): any {
        if (!items) {
            return items;
        }

        return items.filter(item => !item.isDeleted);
    }
}
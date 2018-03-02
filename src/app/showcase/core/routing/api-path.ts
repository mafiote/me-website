import { environment } from '../../../../environments/environment';

/**
 * BACKEND API çağrıları için kullanılan tüm pathlar burada tanımlanacaktır.
 *
 *  !! Server yolu Config dosyasındadır. !!
 *
 * Kullanım kolaylığı için API path buraya da yazılmıştır.
 */


export class ApiPaths {
    /** Tüm API isteklerinin başlangıç adresi */
    public static get API(): string {
        return (environment.apiPath || location.origin) + '/api/';
    }

    /** TOKEN almak için, api ön takısı olmadan ayrı bir path */
    public static get TOKEN(): string {
        return (environment.apiPath || location.origin) + '/token';
    }

    // ApiPath.API ön takısı RsHttpServise bırakıldı. Böylece mocklama yapılabiliyor.
    // public static FI = {
    //     KAIZEN: 'fi/kaizen',
    //     LLS: 'fi/lls',
    //     LLS_SAVING_TYPE: 'fi/llsSavingType',
    //     LLS_SHOW_TYPE: 'fi/llsShowType'
    // };

    public static ACCOUNT = {
        BASE: 'account',
        LOGOUT: 'account/logout'
    };

    public static NOTIFICATION = {
        BASE: 'Notification'
    };

    public static SYS = {
        AUTOCODE: 'autocode',
        FILE: 'file',
        EDI: 'edi',
        ROLE_GROUP: 'sys/RoleGroup'
    };

    public static EDI = {
        ACTION: 'edi/action'
    };

}
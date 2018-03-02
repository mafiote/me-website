export function webPath(screenPath: string) {
    return '/' + screenPath;
}

export const SCREEN = {
    HOME: {
        CODE: 'HOME1',
        PATH: 'home'
    },
    AUTH: {
        LOGIN: {
            CODE: 'AULG1',
            PATH: 'auth/login'
        }
    },
    SYS: {
        DASHBOARD: {
            CODE: 'SY000',
            PATH: 'sys/Dashboard'
        },
        EDI_LOG: {
            CODE: 'SYED1',
            PATH: 'sys/EdiList'
        },
        AUTOCODE: {
            CODE: "SYAC1",
            PATH: "sys/Autocode"
        },
        VERSION: {
            CODE: "SYVC1",
            PATH: "sys/version"
        },
        ROLE_GROUP: {
            CODE: 'SYRL0',
            PATH: 'sys/role'
        },
        NOTIFICATIONS: {
            CODE: 'SYNT0',
            PATH: 'sys/Notifications'
        }
    },
    EDI: {
        ACTION: {
            CODE: 'EDIAC0',
            PATH: 'edi/action'
        }
    }
};

/** Screen seçimi için liste objesi */
export const SCREEN_LIST = [
    SCREEN.HOME,
    SCREEN.AUTH.LOGIN,

    SCREEN.SYS.DASHBOARD,
    SCREEN.SYS.AUTOCODE,
    SCREEN.SYS.EDI_LOG
];

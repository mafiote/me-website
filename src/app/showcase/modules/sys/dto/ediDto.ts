
export class EdiLogDto {
    code: string;
    dateTime: object;
    desc: string;
    refTable: string;
    isRead: boolean;
    isReImport: boolean;

    constructor() {
        this.code = null;
        this.dateTime = null;
        this.desc = null;
        this.refTable = null;
        this.isRead = null;
        this.isReImport = null;
    }
}


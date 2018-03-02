import { RsRefType } from './enum';
export class EdiActionGetDto {
    id: string;
    code: string;
    name: string;
    desc: string;
    isImport: boolean;

    constructor() {
        this.id = null;
        this.code = null;
        this.name = null;
        this.desc = null;
    }
}

export class EdiActionDto extends EdiActionGetDto {
    ediActionDetails: EdiActionDetailDto[];
    ediDataLinks: EdiDataLinkDto[];
    ediActionDataValueGroups: EdiActionDataValueGroupDto[];

    constructor() {
        super();
        this.ediDataLinks = [];
        this.ediActionDataValueGroups = [];
        this.ediActionDetails = [];
    }
}

export class EdiActionDetailDto {
    id: string;
    code: string;
    name: string;
    desc: string;
    orderNum: number;
    apiPath: string;
    params: string;
    isDeleted: boolean;
}

export class EdiDataLinkDto {
    id: string;
    refType: RsRefType;
    refID: string;
    ediData: string;
    isDeleted: boolean;

    refTypeName: string;
    refTypeApiPath: string;
    refName: string;
}


export class EdiActionDataValueGroupDto {
    id: string;
    code: string;
    name: string;
    isDeleted: boolean;
    ediActionDataValueAddDtos: EdiActionDataValueDto[];

    constructor() {
        this.ediActionDataValueAddDtos = [];
    }
}

export class EdiActionDataValueDto {
    id: string;
    refTable: string;
    refID: string;
    value: string;
    isDeleted: boolean;
}
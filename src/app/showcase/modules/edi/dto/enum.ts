import { ApiPaths } from "../../../core/routing/index";

export enum RsRefType {
    test = 1
}

/** AutoComplete için ihtiyaç olan obje */
export const REFTYPE_ENUM_AC = {
    enumObj: RsRefType,
    langKey: 'RsRefType'
};

export function GetRefTypeApiPath(model: RsRefType): string {
    let result: string = "";

    switch (model) {
        // case RsRefType.hcmPersonnel:
        //     result = ApiPaths.PD.PERSONNEL;
        //     break;
        // case RsRefType.qcError:
        //     result = ApiPaths.QC.ERROR_TYPE;
        //     break;
        default:
            result = "";
            break;
    }

    return result;
}
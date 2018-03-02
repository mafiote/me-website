export interface IBaseDto {
    id: string;
}

export class BaseDto implements IBaseDto {
    id: string;
}

export interface IBaseCodeDto extends IBaseDto {
    code: string;
}

export class BaseCodeDto extends BaseDto implements IBaseCodeDto {
    code: string;
}
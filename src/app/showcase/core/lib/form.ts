/**
 * Aşağıdaki linkten alınmıştır.
 * https://stackoverflow.com/questions/40680321/get-all-validation-errors-from-angular-2-formgroup
 */

import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export interface AllValidationErrors {
    control_name: string;
    control_label: string;
    error_name: string;
    error_value: any;
}

export interface FormGroupControls {
    [key: string]: AbstractControl;
}

export function getFormValidationErrors(controls: FormGroupControls): AllValidationErrors[] {
    let errors: AllValidationErrors[] = [];
    Object.keys(controls).forEach(key => {
        const control = controls[key];
        if (control instanceof FormGroup) {
            errors = errors.concat(getFormValidationErrors(control.controls));
        }
        const controlErrors: ValidationErrors = controls[key].errors;
        if (controlErrors !== null) {
            Object.keys(controlErrors).forEach(keyError => {
                errors.push({
                    control_name: key,
                    control_label: controlErrors[keyError]['label'],
                    error_name: keyError.toUpperCase(),
                    error_value: controlErrors[keyError]
                });
            });
        }
    });
    return errors;
}

export interface FilledField {
    control_name: string;
    control_value: any;
}

export function getFormFilledValues(controls: FormGroupControls): FilledField[] {
    let result: FilledField[] = [];
    Object.keys(controls).forEach(key => {
        const control = controls[key];
        if (control instanceof FormGroup) {
            result = result.concat(getFormFilledValues(control.controls));
        }

        if (control.value && control.value['id'] !== undefined) {
            if (control.value['id']) {
                result.push({
                    control_name: key,
                    control_value: control.value['text']
                });
            }
        } else if (control.value) {
            // Autocomplete kontrolü
            if (isDate(control.value)) {
                result.push({
                    control_name: key,
                    control_value: new Date(control.value)
                });
            } else {
                result.push({
                    control_name: key,
                    control_value: control.value
                });
            }
        }
    });
    return result;
}

export function isDate(x) {
    return (null != x) && !isNaN(x) && ("undefined" !== typeof x.getDate);
}


export class RsValidators {

    public static requiredAutoComplete(label: string): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            const isNull = !control || !control.value['id'];
            return isNull ? { 'required': { label: label } } : null;
        };
    }

    public static required(label: string): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            const isNull = !control.value;
            return isNull ? { 'required': { label: label } } : null;
        };
    }

    /** Metin değerin minimum kontrolü */
    public static minLegth(label: string, minLegth: number): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            const isError = control.value ? (control.value.length > minLegth) : false;
            return isError ? { 'minLegth': { label: label, min: minLegth } } : null;
        };
    }

    /** Sayısal değerin minimum kontrolü */
    public static min(label: string, min: number): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            const isError = control.value ? (control.value.length > min) : false;
            return isError ? { 'min': { label: label, min: min } } : null;
        };
    }
}
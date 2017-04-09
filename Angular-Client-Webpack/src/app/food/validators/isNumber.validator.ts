import { Directive, forwardRef } from '@angular/core';
import { Validator, FormControl, NG_VALIDATORS, ValidationErrors } from '@angular/forms';

@Directive({
    selector: '[isNumber][formControlName],[isNumber][formControl],[isNumber][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => IsNumberValidator), multi: true }
    ]
})

export class IsNumberValidator implements Validator {

    validate(c: FormControl): ValidationErrors | null {

        if (isNaN(+c.value)) {
            // console.log(c.value + " is not a number");
            return {
                isNumber:
                {
                    valid: false
                }
            };
        }

        // console.log(c.value + " is a number");
        return null;
    }
}

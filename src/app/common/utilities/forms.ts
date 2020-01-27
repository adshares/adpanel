import { ValidatorFn } from "@angular/forms/src/directives/validators";
import { AbstractControl } from "@angular/forms";

export class CustomValidators {

  static minOrZero(min: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      return !control.value || control.value >= min ? null : {'min': true};
    }
  }

}

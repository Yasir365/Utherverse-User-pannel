import { AbstractControl, FormGroup, ValidationErrors } from "@angular/forms";
export function ConfirmPasswordValidator(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    let control = formGroup.controls[controlName];
    let matchingControl = formGroup.controls[matchingControlName]
    if (
      matchingControl.errors &&
      !matchingControl.errors.confirmPasswordValidator
    ) {
      return;
    }
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ confirmPasswordValidator: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}
export function WalletAddressValidator(controlName: string) {
  return (formGroup: FormGroup) => {
    let wallet_address: any = formGroup.controls[controlName];
    let wallet_address_val: any = formGroup.controls[controlName];
    const ethereumRegex = /^0x[a-fA-F0-9]{40}$/;
    let result = ethereumRegex.test(wallet_address_val);
    if (result) {
      wallet_address.setErrors(null);
    }
    else {
      wallet_address.setErrors({ not_valid_address: true });

    }
  };
}
// export function WalletAddressValidator(control: AbstractControl | any): ValidationErrors | null {
//   const value: string = control.value || '';
//   const hasUppercase = /[A-Z]/.test(value);
//   return hasUppercase ? null : { wrongaddress: true };
// }

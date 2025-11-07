import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  FormGroup,
  FormArray,
} from '@angular/forms';

export class CustomValidators {
  // ✅ Tên không chứa số và ký tự đặc biệt
  static name(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: string = control.value?.trim();

      if (!value) return null;

      // Chỉ cho phép chữ cái có dấu + khoảng trắng
      const regex =
        /^[A-Za-zÀ-ỹàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđĐ\s]{2,}$/u;

      // Tách tên thành các từ
      const words = value.split(/\s+/);

      const allWordsValid = words.every((w) => w.length >= 2);

      if (!regex.test(value) || words.length < 2 || !allWordsValid) {
        return { invalidName: true };
      }

      return null;
    };
  }

  // ✅ Số điện thoại Việt Nam
  static vietnamPhone(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const raw = control.value;
      if (!raw) return null;

      // Bỏ khoảng trắng, dấu gạch, chấm
      const value = raw.replace(/[\s\-.]/g, '');

      // Bắt đầu bằng +84 → thay thế thành 0 để đơn giản hóa validate
      const normalized = value.startsWith('+84') ? '0' + value.slice(3) : value;

      // ✅ Di động VN: bắt đầu 01–09, độ dài đúng 10 chữ số
      const mobileRegex = /^0[1-9][0-9]{8}$/;

      return mobileRegex.test(normalized) ? null : { invalidPhone: true };
    };
  }

  static passwordStrength(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      // Yêu cầu: ít nhất 8 ký tự, ít nhất 1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

      return regex.test(value) ? null : { weakPassword: true };
    };
  }

  // ✅ So khớp password và retype
  static matchFields(field1: string, field2: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const f1 = group.get(field1)?.value;
      const f2 = group.get(field2)?.value;
      if (f1 !== f2) {
        group.get(field2)?.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      }
      return null;
    };
  }

  static notZero(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.disabled) return null; // Bỏ qua nếu đang disable
      return control.value === 0 ? { notZero: true } : null;
    };
  }
}

import { AbstractControl } from '@angular/forms';

export function getFormError(
  control: AbstractControl | null,
  label = 'Trường này'
): string | null {
  if (!control || !control.errors || (!control.touched && !control.dirty))
    return null;

  if (control.errors['required']) {
    return `${label} không được để trống.`;
  }

  if (control.errors['email']) {
    return `Vui lòng nhập địa chỉ email hợp lệ.`;
  }
  if (control.errors['product']) {
    return `Vui lòng chọn sản phẩm hợp lệ.`;
  }

  if (control.errors['quantity']) {
    return `Vui lòng nhập khối lượng hợp lệ.`;
  }

  if (control.errors['address']) {
    return `Vui lòng nhập địa chỉ nhận hàng hợp lệ.`;
  }

  if (control.errors['min']) {
    return `Khối lượng không được nhỏ hơn 1`;
  }

  if (control.errors['max']) {
    return `Khối lượng nhập vào vượt quá giá trị tối đa`;
  }

  if (control.errors['invalidPhone']) {
    return `Số điện thoại không hợp lệ. Vui lòng nhập số di động Việt Nam đúng định dạng.`;
  }

  if (control.errors['invalidName']) {
    return `Họ và tên không hợp lệ. Vui lòng nhập ít nhất 2 từ, không chứa số hoặc ký tự đặc biệt.`;
  }

  if (control.errors['weakPassword']) {
    return `Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.`;
  }

  if (control.errors['passwordMismatch']) {
    return `Mật khẩu nhập lại không khớp.`;
  }

  return `Giá trị không hợp lệ.`;
}

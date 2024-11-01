import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class SwalService {
  constructor() {}

  showSuccess(message: string) {
    Swal.fire('Success', message, 'success');
  }

  showError(message: string) {
    Swal.fire('Error', message, 'error');
  }

  showWarning(message: string) {
    Swal.fire('Warning', message, 'warning');
  }

  showInfo(message: string) {
    Swal.fire('Info', message, 'info');
  }

  showConfirm(message: string): Promise<any> {
    return Swal.fire({
      title: 'Are you sure?',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    });
  }

  confirmBox(message: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      Swal.fire({
        title: 'Are you sure?',
        text: message,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  confirmExportBox(message: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      Swal.fire({
        title: 'Are you sure?',
        text: message,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#1e90ff',
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }
}

import { Injectable, TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  public toasts: any[] = [];

  showSuccess(msg: string) {
    this.show(msg, { classname: 'bg-success text-light', delay: 2000 });
  }

  showDanger(msg: string) {
    this.show(msg, { classname: 'bg-danger text-light', delay: 2000 });
  }

  remove(toast: any) {
    this.toasts = this.toasts.filter(t => t != toast);
  }

  private show(text: string, options: any = {}) {
    this.toasts.push({ body: text, ...options });
  }
}

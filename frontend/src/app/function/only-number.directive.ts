import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appOnlyNumber]',
})
export class OnlyNumberDirective {
  @Input() decimal: boolean = false;

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const initialValue = this.el.nativeElement.value;
    const pattern = this.decimal ? /^[0-9]+(\.[0-9]{0,2})?$/ : /^[0-9]*$/;

    if (initialValue.match(pattern)) {
      // Allow the input
    } else {
      // Prevent invalid input
      event.preventDefault();
      this.el.nativeElement.value = initialValue.replace(/[^0-9\.]/g, '');
    }
  }
}

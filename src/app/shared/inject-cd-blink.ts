// a utility function designed to visually indicate Angular's change detection process by briefly 
// changing the background color of a component's first child element
import {ElementRef,NgZone,inject} from '@angular/core';

export function injectCdBlink(): () => null {
  const element = inject(ElementRef);
  const zone = inject(NgZone);
  let active = false;

  const blink = () => {
    // Dirty Hack used to visualize the change detector
    const selectedColor =
      element.nativeElement.firstChild.style.backgroundColor;
    const visualizerColor = 'crimson';

    !active &&
      zone.runOutsideAngular(() => {
        active = true;
        setTimeout(() => {
          element.nativeElement.firstChild.style.backgroundColor =
            visualizerColor;
        });
        setTimeout(() => {
          element.nativeElement.firstChild.style.backgroundColor =
            selectedColor;
          active = false;
        }, 500);
      });

    return null;
  };

  return blink;
}

import {CommonModule} from '@angular/common';
import {AfterViewInit,Component,ElementRef,NgZone,OnInit} from '@angular/core';
import {injectCdBlink} from './inject-cd-blink';

@Component({
  selector: 'app-change-detection-visualizer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="visualizer">
      <h3>Change Detection Visualizer</h3>
      <p>Content goes here...</p>
      <button (click)="triggerChangeDetection()">Trigger Change Detection</button>
    </div>
  `,
  styles: [
    `
      .visualizer {
        border: 1px solid #000;
        padding: 10px;
        background-color: lightyellow;
      }
    `
  ]
})
export class ChangeDetectionVisualizerComponent implements OnInit, AfterViewInit {
  blink = injectCdBlink(); // Use the utility to create a blink function

  constructor(private elementRef: ElementRef, private ngZone: NgZone) {}

  ngOnInit() {
    // Optional: Initial check to ensure the blink function is defined
    if (this.blink()) {
      console.log('Blink function initialized successfully');
    } else {
      console.error('Blink function could not be initialized');
    }
  }

  ngAfterViewInit() {
    // Check if the component's first child element is accessible
    const firstChild = this.elementRef.nativeElement.firstChild;
    if (!firstChild) {
      console.warn('No first child element found. The blink effect might not work.');
      return;
    }

    // Additional checks to ensure the element has a style property
    if (!firstChild.style) {
      console.warn('First child element does not support styling.');
      return;
    }

    // Perform a blink to verify everything is working correctly
    this.blink();
  }

  triggerChangeDetection() {
    // Manually trigger the blink effect with additional checks
    if (this.blink && typeof this.blink === 'function') {
      // Check if the element still exists and is accessible before calling blink
      const firstChild = this.elementRef.nativeElement.firstChild;
      if (firstChild && firstChild.style) {
        // Run the blink function outside of Angular's zone to avoid triggering change detection
        this.ngZone.runOutsideAngular(() => {
          this.blink();
        });
      } else {
        console.warn('Element not found or does not support styling. Blink effect skipped.');
      }
    } else {
      console.error('Blink function is not defined or is not a function.');
    }
  }
}
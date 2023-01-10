/***************************************************************************************************
 * Zone JS is required by Angular itself.
 */
import 'zone.js'; // Included with Angular CLI.

/***************************************************************************************************
 * APPLICATION IMPORTS
 */
import { Buffer } from 'buffer';
(window as any).Buffer = Buffer;
(window as any).global = window;
(window as any).process = {
  env: { DEBUG: undefined },
  nextTick: require('next-tick'),
};

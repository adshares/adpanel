import { animate, query, style, transition, trigger } from '@angular/animations';

import { appSettings } from 'app-settings';

export const fadeAnimation = trigger('fadeAnimation', [
  transition('* => *', [
    query(':enter', [style({ opacity: 0 })], { optional: true }),
    query(
      ':leave',
      [style({ opacity: 1 }), animate(`${appSettings.ROUTER_TRANSITION_DURATION}ms`, style({ opacity: 0 }))],
      {
        optional: true,
      }
    ),
    query(
      ':enter',
      [style({ opacity: 0 }), animate(`${appSettings.ROUTER_TRANSITION_DURATION}ms`, style({ opacity: 1 }))],
      {
        optional: true,
      }
    ),
  ]),
]);

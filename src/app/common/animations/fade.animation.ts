import { trigger, animate, transition, style, query } from '@angular/animations';
import { APP_SETTINGS } from '../../../app-settings/app-settings';

export const fadeAnimation =
  trigger('fadeAnimation', [
    transition( '* => *', [
      query(':enter',
        [
          style({ opacity: 0 })
        ],
        { optional: true }
      ),
      query(':leave',
        [
          style({ opacity: 1 }),
          animate(`${APP_SETTINGS.routerTransitionDuration}ms`, style({ opacity: 0 }))
        ],
        { optional: true }
      ),
      query(':enter',
        [
          style({ opacity: 0 }),
          animate(`${APP_SETTINGS.routerTransitionDuration}ms`, style({ opacity: 1 }))
        ],
        { optional: true }
      )
    ])
  ]);

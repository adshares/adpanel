import { trigger, animate, transition, style, query } from '@angular/animations';
import { CONSTANT } from '../../../app-settings/app-settings';

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
          animate(`${CONSTANT.routerTransitionDuration}ms`, style({ opacity: 0 }))
        ],
        { optional: true }
      ),
      query(':enter',
        [
          style({ opacity: 0 }),
          animate(`${CONSTANT.routerTransitionDuration}ms`, style({ opacity: 1 }))
        ],
        { optional: true }
      )
    ])
  ]);

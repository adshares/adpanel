import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class EditSiteHelpersService {

  constructor(private router: Router) { }

  siteObligatoryFieldFilled(field: string) {
    const fieldFilled = field !== '';

    if (!fieldFilled) {
      this.router.navigate(
        ['/publisher', 'create-site', 'basic-information'],
        { queryParams: { step: 1 } }
      );
    }

    return fieldFilled
  }
}

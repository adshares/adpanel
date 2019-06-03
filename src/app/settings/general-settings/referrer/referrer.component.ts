import { Component, OnInit } from '@angular/core';

import { SessionService } from 'app/session.service';

@Component({
  selector: 'app-referrer',
  templateUrl: './referrer.component.html',
  styleUrls: ['./referrer.component.scss']
})
export class ReferrerComponent implements OnInit {
  referrerLink?: string;

  constructor(private session: SessionService) {
  }

  ngOnInit() {
    const user = this.session.getUser();
    const referralId = user.referralId;
    const domain = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');

    this.referrerLink = referralId ? `${domain}/auth/register?r=${referralId}` : 'N/A';
  }

  copyInput(input: HTMLInputElement): void {
    input.select();
    document.execCommand('copy');
    input.setSelectionRange(0, 0);
  }
}

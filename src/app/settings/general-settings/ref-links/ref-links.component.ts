import { Component, OnInit } from '@angular/core';

import { SessionService } from 'app/session.service';

@Component({
  selector: 'app-ref-links',
  templateUrl: './ref-links.component.html',
  styleUrls: ['./ref-links.component.scss']
})
export class RefLinksComponent implements OnInit {
  referrerLink?: string;

  constructor(private session: SessionService) {
  }

  ngOnInit() {
    const user = this.session.getUser();
    const referralId = 'XYZ'//user.referralToken;
    const domain = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');

    this.referrerLink = referralId ? `${domain}/auth/login?r=${referralId}` : 'N/A';
  }

  copyInput(input: HTMLInputElement): void {
    input.select();
    document.execCommand('copy');
    input.setSelectionRange(0, 0);
  }
}

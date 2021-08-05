import { Component } from '@angular/core'
import { environment } from 'environments/environment'

@Component({
  selector: 'page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
})
export class PageNotFoundComponent {
  supportEmail: string

  constructor () {
    this.supportEmail = environment.supportEmail
  }
}

import { Component, OnInit } from '@angular/core'
import { MatDialogRef } from '@angular/material'
import { faCode } from '@fortawesome/free-solid-svg-icons'
import { HandleSubscription } from 'common/handle-subscription'
import { PublisherService } from 'publisher/publisher.service'

@Component({
  selector: 'app-site-code-cryptovoxels-dialog',
  templateUrl: './site-code-cryptovoxels-dialog.component.html',
  styleUrls: ['./site-code-cryptovoxels-dialog.component.scss'],
})
export class SiteCodeCryptovoxelsDialogComponent extends HandleSubscription implements OnInit {
  readonly faCode = faCode
  code: string | null = null
  loaded: boolean = false

  constructor (
    public dialogRef: MatDialogRef<SiteCodeCryptovoxelsDialogComponent>,
    private publisherService: PublisherService,
  ) {
    super()
  }

  ngOnInit (): void {
    const codeSubscription = this.publisherService.getCryptovoxelsCode()
      .subscribe(
        response => {
          this.code = response.code
          this.loaded = true
        },
        () => {
          this.loaded = true
        }
      )
    this.subscriptions.push(codeSubscription)
  }

  copyCode (elementId: string): void {
    const input = <HTMLInputElement>document.getElementById(elementId)
    input.focus()
    input.select()
    document.execCommand('copy')
    input.setSelectionRange(0, 0)
  }
}

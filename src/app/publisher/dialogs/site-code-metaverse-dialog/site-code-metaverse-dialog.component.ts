import { Component, Inject } from '@angular/core'
import { MatDialogRef } from '@angular/material'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'app-site-code-metaverse-dialog',
  templateUrl: './site-code-metaverse-dialog.component.html',
  styleUrls: ['./site-code-metaverse-dialog.component.scss'],
})
export class SiteCodeMetaverseDialogComponent {
  constructor (
    public dialogRef: MatDialogRef<SiteCodeMetaverseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }
}

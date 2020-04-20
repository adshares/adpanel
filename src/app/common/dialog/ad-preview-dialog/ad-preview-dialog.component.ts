import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdPreview } from 'models/campaign.model';

@Component({
  selector: 'app-ad-preview-dialog',
  templateUrl: './ad-preview-dialog.component.html',
  styleUrls: ['./ad-preview-dialog.component.scss'],
})
export class AdPreviewDialogComponent {
  isHtml: boolean;
  width: string;
  height: string;

  constructor(
    public dialogRef: MatDialogRef<AdPreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AdPreview,
  ) {
  }

  ngOnInit() {
    this.isHtml = this.data.isHtml;
    const sizeArray = this.data.size.split('x');
    this.width = sizeArray[0] + 'px';
    this.height = sizeArray[1] + 'px';
  }
}

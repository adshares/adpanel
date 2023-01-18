import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdPreview } from 'models/campaign.model';
import { adCreativeTypes } from 'models/enum/ad.enum';

@Component({
  selector: 'app-ad-preview-dialog',
  templateUrl: './ad-preview-dialog.component.html',
  styleUrls: ['./ad-preview-dialog.component.scss'],
})
export class AdPreviewDialogComponent implements OnInit {
  readonly adCreativeTypes = adCreativeTypes;
  type: string;
  width: string;
  height: string;

  constructor(
    public dialogRef: MatDialogRef<AdPreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AdPreview
  ) {}

  ngOnInit(): void {
    this.type = this.data.type;
    if (this.type === adCreativeTypes.MODEL) {
      this.width = '450px';
      this.height = '450px';
    } else {
      const sizeArray = this.data.size.split('x');
      this.width = sizeArray[0] + 'px';
      this.height = sizeArray[1] + 'px';
    }
  }
}

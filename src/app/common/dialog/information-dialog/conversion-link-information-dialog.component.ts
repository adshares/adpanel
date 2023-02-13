import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CONVERSIONS_DESCRIPTION } from 'models/enum/link.enum';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { HelperService } from 'common/helper.service';

@Component({
  selector: 'app-conversion-link-information-dialog',
  templateUrl: './conversion-link-information-dialog.component.html',
  styleUrls: ['./conversion-link-information-dialog.component.scss'],
})
export class ConversionLinkInformationDialogComponent implements OnInit {
  isAdvanced: boolean;
  link: string;
  CONVERSIONS_DESCRIPTION = CONVERSIONS_DESCRIPTION;
  faCopy = faCopy;

  constructor(
    public dialogRef: MatDialogRef<ConversionLinkInformationDialogComponent>,
    private helpersService: HelperService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.isAdvanced = this.data && this.data.hasOwnProperty('isAdvanced') ? this.data.isAdvanced : true;
    this.link = this.data && this.data.link ? this.data.link : '';
  }

  copyToClipboard(content: string) {
    this.helpersService.copyToClipboard(content);
  }
}

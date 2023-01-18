import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppState } from 'models/app-state.model';
import { ShowSuccessSnackbar } from 'store/common/common.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-conversion-link-information-dialog',
  templateUrl: './conversion-link-information-dialog.component.html',
  styleUrls: ['./conversion-link-information-dialog.component.scss'],
})
export class ConversionLinkInformationDialogComponent implements OnInit {
  isAdvanced: boolean;
  link: string;

  constructor(
    public dialogRef: MatDialogRef<ConversionLinkInformationDialogComponent>,
    private store: Store<AppState>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.isAdvanced = this.data && this.data.hasOwnProperty('isAdvanced') ? this.data.isAdvanced : true;
    this.link = this.data && this.data.link ? this.data.link : '';
  }

  copyToClipboard(content: string) {
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', content);
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
    this.store.dispatch(new ShowSuccessSnackbar('Copied!'));
  }
}

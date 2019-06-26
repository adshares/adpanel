import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppState } from "models/app-state.model";
import { ShowSuccessSnackbar } from "store/common/common.actions";
import { Store } from "@ngrx/store";

@Component({
  selector: 'app-information-dialog',
  templateUrl: './information-dialog.component.html',
  styleUrls: ['./information-dialog.component.scss'],
})
export class InformationDialogComponent {
  title: string = '';
  message: string = '';
  link: string = '';
  href: string = '';
  secret: string = '';


  constructor(
    public dialogRef: MatDialogRef<InformationDialogComponent>,
    private store: Store<AppState>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  ngOnInit() {
    this.message = (this.data && this.data.message) ? this.data.message : '';
    this.title = (this.data && this.data.title) ? this.data.title : '';
    this.link = (this.data && this.data.link) ? this.data.link : '';
    this.href = (this.data && this.data.href) ? this.data.href : '';
    this.secret = (this.data && this.data.secret) ? this.data.secret : '';
  }

  copyToClipboard(content: string) {
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (content));
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
    this.store.dispatch(new ShowSuccessSnackbar('Copied!'))
  }
}

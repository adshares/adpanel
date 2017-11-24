import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { CustomizeAccountChooseDialogComponent } from '../common/dialog/customize-account-choose-dialog/customize-account-choose-dialog.component';
import { WalletDialogComponent } from '../settings/dialogs/wallet-dialog/wallet-dialog.component';
import { UserModel } from '../auth/store/user.model';

@Component({
  selector: 'app-advertiser',
  templateUrl: './advertiser.component.html',
  styleUrls: ['./advertiser.component.scss']
})
export class AdvertiserComponent implements OnInit {
  userState: Observable<{UserModel}>[];

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private store: Store<{auth: { UserModel }}>
  ) { }

  ngOnInit() {
    const firstLogin = this.route.snapshot.queryParams['customize'];

    console.log('data', this.store.select('auth').subscribe((data) => console.log(data)));

    // console.log(this.userState);

    if (firstLogin) {
      // ExpressionChangedAfterItHasBeenCheckedError bug fix
      setTimeout(() => this.handleChooseAccountDialog());
    }
  }

  handleChooseAccountDialog() {
    const dialogRef = this.dialog.open(CustomizeAccountChooseDialogComponent);

    dialogRef.afterClosed()
      .subscribe(
        (accounts) => this.hadleCustomizeDialog(accounts)
      );
  }

  hadleCustomizeDialog(accounts) {
    if (!accounts) {
      return;
    }

    if (!accounts.advertiser.selected && accounts.publisher.selected) {
      this.router.navigate(['/publisher']);
    }

    this.dialog.open(WalletDialogComponent);
  }
}

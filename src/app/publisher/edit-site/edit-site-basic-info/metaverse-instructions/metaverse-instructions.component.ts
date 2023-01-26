import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { faExternalLinkSquareAlt } from '@fortawesome/free-solid-svg-icons';
import { SessionService } from '../../../../session.service';
import { environment } from 'environments/environment';
import { ADD_UNIT_CRYPTOVOXELS, ADD_UNIT_DECENTRALAND, ADD_UNIT_DECENTRALAND_SMART } from 'models/enum/link.enum';
import { UserAdserverWallet } from 'models/user.model';
import { SiteCodeCryptovoxelsDialogComponent } from 'publisher/dialogs/site-code-cryptovoxels-dialog/site-code-cryptovoxels-dialog.component';
import { CryptovoxelsConverter } from 'common/utilities/targeting-converter/cryptovoxels-converter';
import { DecentralandConverter } from 'common/utilities/targeting-converter/decentraland-converter';

@Component({
  selector: 'app-metaverse-instructions',
  templateUrl: './metaverse-instructions.component.html',
  styleUrls: ['./metaverse-instructions.component.scss'],
})
export class MetaverseInstructionsComponent {
  readonly ADD_UNIT_CRYPTOVOXELS = ADD_UNIT_CRYPTOVOXELS;
  readonly ADD_UNIT_DECENTRALAND = ADD_UNIT_DECENTRALAND;
  readonly ADD_UNIT_DECENTRALAND_SMART = ADD_UNIT_DECENTRALAND_SMART;
  readonly CRYPTOVOXELS = CryptovoxelsConverter.ID;
  readonly DECENTRALAND = DecentralandConverter.ID;
  readonly faExternalLinkSquareAlt = faExternalLinkSquareAlt;
  readonly serverUrl: string = environment.serverUrl;
  @Input() vendor: string;

  constructor(private session: SessionService, private dialog: MatDialog) {}

  get wallet(): UserAdserverWallet {
    return this.session.getUser().adserverWallet;
  }

  openGetCryptovoxelsCodeDialog(): void {
    this.dialog.open(SiteCodeCryptovoxelsDialogComponent);
  }
}

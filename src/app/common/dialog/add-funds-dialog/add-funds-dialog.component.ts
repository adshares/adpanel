import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import {
  Country,
  DepositInfo,
  FiatInfo,
  Invoice,
  NowPaymentsInfo,
  NowPaymentsInit,
  UnwrappersInfo,
} from 'models/settings.model';
import { ApiService } from 'app/api/api.service';
import { SessionService } from 'app/session.service';
import { forkJoin as observableForkJoin } from 'rxjs';
import { isNumeric } from 'rxjs/internal-compatibility';
import { take } from 'rxjs/operators';
import { CODE, CRYPTO } from 'common/utilities/consts';
import { Contract } from 'web3-eth-contract';
import { hexToNumber } from 'web3-utils';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from 'settings/settings.service';
import Web3 from 'web3';
import { ServerOptionsService } from 'common/server-options.service';
import { AppState } from 'models/app-state.model';
import { GET_ADS_FAQ } from 'models/enum/link.enum';
import { UserAdserverWallet } from 'models/user.model';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { HelperService } from 'common/helper.service';

@Component({
  selector: 'app-add-funds-dialog',
  templateUrl: './add-funds-dialog.component.html',
  styleUrls: ['./add-funds-dialog.component.scss'],
})
export class AddFundsDialogComponent extends HandleSubscriptionComponent implements OnInit {
  readonly ADS_TOKEN_CODE = 'ADS';
  abi: any = [
    {
      constant: true,
      inputs: [
        {
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
      ],
      name: 'balanceOf',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
        {
          internalType: 'uint64',
          name: 'to',
          type: 'uint64',
        },
        {
          internalType: 'uint128',
          name: 'message',
          type: 'uint128',
        },
      ],
      name: 'unwrapMessage',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ];

  getAdsFaqLink = GET_ADS_FAQ;
  appCurrency: string;
  crypto: string = CRYPTO;
  code: string = CODE;
  isAutoWithdrawal: boolean = false;
  isConfirmed = false;

  loadingInfo: boolean = true;
  showLoader: boolean = false;
  useNativeDeposit: boolean = false;
  useWrappedDeposit: boolean = false;
  useNowPaymentsDeposit: boolean = false;
  useFiatDeposit: boolean = false;

  adsharesAddress: string = '';
  paymentMemo: string = '';

  unwrappers: UnwrappersInfo[];
  metamaskConnected: boolean = false;
  isMetamaskConnecting: boolean = false;
  metamaskAvailable: boolean = false;
  metamaskAccount: string;
  metamaskNetwork: string;
  metamaskAccountAds: string = '?';
  metamaskError: string = null;
  metamaskTxid: string = null;
  metamaskChainError: boolean = false;
  wrappedAmountError: boolean = false;
  web3: any;
  tokenContract: Contract;

  nowPayments: NowPaymentsInfo;
  nowPaymentsDefaultAmount: number = 100;
  nowPaymentsAmount: number;
  nowPaymentsAdsAmount: number;
  nowPaymentsAmountError: boolean = false;
  nowPaymentsServerError: boolean = false;

  countries: Country[];
  filteredCountries: Country[];

  fiat: FiatInfo;
  fiatCurrency: string;
  fiatForm: FormGroup;
  fiatEuVatDisabled: boolean = true;
  fiatInvoice: Invoice;

  isFormBeingSubmitted: boolean = false;
  faCopy = faCopy;

  constructor(
    public dialogRef: MatDialogRef<AddFundsDialogComponent>,
    private api: ApiService,
    private router: Router,
    private serverOptionsService: ServerOptionsService,
    private session: SessionService,
    private settings: SettingsService,
    private store: Store<AppState>,
    private helperService: HelperService
  ) {
    super();
  }

  ngOnInit(): void {
    this.appCurrency = this.serverOptionsService.getOptions().appCurrency;
    const user = this.session.getUser();
    this.isConfirmed = user.isConfirmed;

    const walletSubscription = this.store
      .select('state', 'user', 'data', 'adserverWallet')
      .pipe(take(2))
      .subscribe((wallet: UserAdserverWallet) => {
        this.isAutoWithdrawal = wallet.isAutoWithdrawal;
      });
    this.subscriptions.push(walletSubscription);

    const infoSubscription = observableForkJoin([this.api.config.depositInfo(), this.api.config.countries()]).subscribe(
      (responses: [DepositInfo, Country[]]) => {
        const info = responses[0];
        this.loadingInfo = false;
        this.adsharesAddress = info.address;
        this.paymentMemo = info.message;
        this.nowPayments = info.nowPayments;
        this.unwrappers = info.unwrappers;
        this.fiat = info.fiat;
        this.countries = responses[1];
        this.filteredCountries = this.countries;
        if (this.nowPayments !== null) {
          this.setNowPaymentsAmount(this.nowPayments.minAmount);
        }
        if (this.unwrappers !== null) {
          this.initializeEthers();
        }
        if (this.fiat !== null) {
          this.initializeFiats();
        }
      }
    );
    this.subscriptions.push(infoSubscription);
  }

  initializeEthers() {
    const ethereum = (window as any).ethereum;
    this.metamaskAvailable = typeof ethereum !== 'undefined';
    if (this.metamaskAvailable) {
      ethereum.on('accountsChanged', this.onAccountChanges.bind(this));
      ethereum.on('chainChanged', this.onChainChange.bind(this));
    }
  }

  async onChainChange(chainId) {
    chainId = hexToNumber(chainId);
    this.metamaskChainError = false;
    const ethereum = (window as any).ethereum;
    if (this.unwrappers !== null) {
      const unwrapper = this.unwrappers.find(x => x.chainId == chainId);
      if (unwrapper != null) {
        this.metamaskNetwork = unwrapper.networkName;
        this.web3 = new Web3(ethereum);
        this.tokenContract = new this.web3.eth.Contract(this.abi, unwrapper.contractAddress);
        this.metamaskConnected = true;
        try {
          const accounts = await ethereum.request({
            method: 'eth_requestAccounts',
          });
          this.onAccountChanges(accounts);
          return;
        } catch (error) {}
      }
    }
    this.metamaskConnected = false;
    this.metamaskChainError = true;
  }

  async onAccountChanges(accounts) {
    this.metamaskAccountAds = '?';
    this.metamaskAccount = accounts[0];
    const balance = await this.tokenContract.methods.balanceOf(this.metamaskAccount).call();
    this.metamaskAccountAds = (balance / 1e11).toFixed(4);
  }

  async connectMetamask() {
    this.isMetamaskConnecting = true;
    const ethereum = (window as any).ethereum;

    try {
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      this.onChainChange(chainId);
      this.isMetamaskConnecting = false;
    } catch (error) {
      this.isMetamaskConnecting = false;
    }
  }

  initializeFiats(): void {
    this.fiatForm = new FormGroup({
      netAmount: new FormControl(this.fiat.minAmount, [
        Validators.required,
        Validators.min(this.fiat.minAmount),
        Validators.max(this.fiat.maxAmount),
      ]),
      buyerName: new FormControl(null, [Validators.required, Validators.maxLength(256)]),
      buyerAddress: new FormControl(null, [Validators.required, Validators.maxLength(256)]),
      buyerPostalCode: new FormControl(null, [Validators.maxLength(16)]),
      buyerCity: new FormControl(null, [Validators.maxLength(128)]),
      buyerCountry: new FormControl(null, [Validators.required]),
      buyerVatId: new FormControl(null, [Validators.required, Validators.maxLength(32)]),
      euVat: new FormControl(false, [Validators.required]),
      comments: new FormControl(null, Validators.maxLength(256)),
    });
    this.subscriptions.push(
      this.fiatForm.valueChanges.subscribe(() => {
        const country = this.fiatForm.get('buyerCountry').value;
        this.fiatEuVatDisabled = !country || !country.euTax;
        if (this.fiatEuVatDisabled) {
          this.fiatForm.get('euVat').value && this.fiatForm.get('euVat').setValue(false);
        }
      })
    );
  }

  filterCountries(event): void {
    const filter = event.target.value.toLowerCase();
    this.filteredCountries = this.countries.filter(
      country => country.name.toLowerCase().indexOf(filter) > -1 || country.code.toLowerCase().indexOf(filter) > -1
    );
  }

  onFiatSubmit(): void {
    this.isFormBeingSubmitted = true;
    if (!this.fiatForm.valid) {
      return;
    }

    this.showLoader = true;
    const data = this.fiatForm.getRawValue();
    Object.keys(data).forEach(key => data[key] == null && delete data[key]);

    if (data.buyerCountry) {
      data.buyerCountry = data.buyerCountry.code;
    }
    data.currency = this.fiatCurrency;

    this.subscriptions.push(
      this.settings.saveInvoice(data).subscribe(
        (invoice: Invoice) => {
          this.fiatInvoice = invoice;
        },
        err => {
          if (err.error.errors) {
            Object.keys(err.error.errors).forEach(key =>
              this.fiatForm.get(key).setErrors({
                custom: err.error.errors[key][0],
              })
            );
          }
          this.showLoader = false;
        },
        () => {
          this.showLoader = false;
          this.isFormBeingSubmitted = false;
        }
      )
    );
  }

  copyInput(input: HTMLInputElement): void {
    this.helperService.copyToClipboard(input.value);
  }

  selectNativeDeposit(): void {
    this.useNativeDeposit = true;
    this.useNowPaymentsDeposit = false;
    this.useWrappedDeposit = false;
    this.useFiatDeposit = false;
  }

  selectWrappedDeposit(): void {
    this.useNativeDeposit = false;
    this.useNowPaymentsDeposit = false;
    this.useWrappedDeposit = true;
    this.useFiatDeposit = false;
  }

  selectNowPaymentsDeposit(): void {
    this.useNativeDeposit = false;
    this.useNowPaymentsDeposit = true;
    this.useWrappedDeposit = false;
    this.useFiatDeposit = false;
  }

  selectFiatDeposit(currency: string): void {
    this.useNativeDeposit = false;
    this.useNowPaymentsDeposit = false;
    this.useWrappedDeposit = false;
    this.useFiatDeposit = true;
    this.fiatCurrency = currency;
  }

  restartDepositMethod(): void {
    this.useNativeDeposit = false;
    this.useNowPaymentsDeposit = false;
    this.useWrappedDeposit = false;
    this.useFiatDeposit = false;
    this.fiatInvoice = null;
  }

  validNowPaymentsAmount(amount) {
    return isNumeric(amount) && amount >= this.nowPayments.minAmount && amount <= this.nowPayments.maxAmount;
  }

  setNowPaymentsAmount(amount: number) {
    this.nowPaymentsAmount = amount;
    this.nowPaymentsAdsAmount = Math.round(1e11 * (this.nowPaymentsAmount / this.nowPayments.exchangeRate));
  }

  keydownNowPaymentsAmount(event) {
    if (this.validNowPaymentsAmount(event.target.value)) {
      this.setNowPaymentsAmount(event.target.value);
    }
  }

  changeNowPaymentsAmount(event) {
    if (!this.validNowPaymentsAmount(event.target.value)) {
      this.nowPaymentsAdsAmount = null;
      this.nowPaymentsAmountError = true;
      return;
    }

    this.nowPaymentsAmountError = false;
    this.setNowPaymentsAmount(event.target.value);
  }

  async depositWrapped() {
    if (this.isFormBeingSubmitted) {
      return;
    }
    this.metamaskError = null;
    this.metamaskTxid = null;
    let amount: number = parseFloat((<HTMLInputElement>document.getElementById('wrapped_amount')).value);
    if (!amount || amount > parseFloat(this.metamaskAccountAds)) {
      this.wrappedAmountError = true;
    } else {
      this.wrappedAmountError = false;
      this.isFormBeingSubmitted = true;
      try {
        const result = await this.tokenContract.methods
          .unwrapMessage(
            (amount * 1e11).toFixed(0),
            '0x' + this.adsharesAddress.replace(/-/g, ''),
            '0x' + this.paymentMemo
          )
          .send({ from: this.metamaskAccount });
        this.metamaskTxid = result.transactionHash;
      } catch (error) {
        this.metamaskError = error.message;
      }

      this.isFormBeingSubmitted = false;
    }
  }

  depositNowPaymentsFunds() {
    this.isFormBeingSubmitted = true;
    this.nowPaymentsServerError = false;

    if (this.nowPaymentsAmountError) {
      this.isFormBeingSubmitted = false;
      return;
    }

    this.api.config.nowPaymentsInit(this.nowPaymentsAmount).subscribe((data: NowPaymentsInit) => {
      if (data.nowPaymentsUrl) {
        window.location.href = data.nowPaymentsUrl;
      } else {
        this.isFormBeingSubmitted = false;
        this.nowPaymentsServerError = true;
      }
    });
  }

  navigateToSettings(_$event: MouseEvent): void {
    this.router.navigate(['/settings', 'general', 'wallet']).then(() => this.dialogRef.close());
  }
}

import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { HandleSubscription } from 'common/handle-subscription';
import { DepositInfo, NowPaymentsInfo, NowPaymentsInit, UnwrappersInfo } from 'models/settings.model';
import { ApiService } from 'app/api/api.service';
import { SessionService } from 'app/session.service';
import { isNumeric } from "rxjs/util/isNumeric";
import { environment } from "environments/environment";
import { CODE, CRYPTO } from "common/utilities/consts";

import { Contract } from 'web3-eth-contract';
import {hexToNumber} from 'web3-utils';
import {appSettings} from "app-settings";
const Web3 = require('web3');

@Component({
  selector: 'app-add-funds-dialog',
  templateUrl: './add-funds-dialog.component.html',
  styleUrls: ['./add-funds-dialog.component.scss']
})
export class AddFundsDialogComponent extends HandleSubscription implements OnInit {
    abi: any = [{
        "constant": true,
        "inputs": [{
            "internalType": "address",
            "name": "account",
            "type": "address"
        }
        ],
        "name": "balanceOf",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
        }, {
            "internalType": "uint64",
            "name": "to",
            "type": "uint64"
        }, {
            "internalType": "uint128",
            "name": "message",
            "type": "uint128"
        }
        ],
        "name": "unwrapMessage",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }];

  getAdsFaqLink = appSettings.GET_ADS_FAQ_LINK;
  environment = environment;
  crypto: string = CRYPTO;
  code: string = CODE;
  isEmailConfirmed = false;

  loadingInfo: boolean = true;
  useNativeDeposit: boolean = false;
  useWrappedDeposit: boolean = false;
  useNowPaymentsDeposit: boolean = false;

  adsharesAddress: string = '';
  paymentMemo: string = '';

  unwrappers: UnwrappersInfo[];
  metamaskConnected: boolean = false;
  isMetamaskConnecting: boolean = false;
  metamaskAvailable: boolean = false;
  metamaskAccount: string;
  metamaskNetwork: string;
  metamaskAccountAds: string = "?";
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

  isFormBeingSubmitted: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AddFundsDialogComponent>,
    private api: ApiService,
    private session: SessionService,
  ) {
    super();
  }

  ngOnInit() {
    const user = this.session.getUser();
    this.isEmailConfirmed = user.isEmailConfirmed;

    const infoSubscription = this.api.config.depositInfo().subscribe((data: DepositInfo) => {
      this.loadingInfo = false;
      this.adsharesAddress = data.address;
      this.paymentMemo = data.message;
      this.nowPayments = data.nowPayments;
      this.unwrappers = data.unwrappers;
      if (this.nowPayments !== null) {
        this.setNowPaymentsAmount(this.nowPayments.minAmount);
      }
      if (this.unwrappers !== null) {
        this.initializeEthers();
      }
    });
    this.subscriptions.push(infoSubscription);
  }

  initializeEthers() {
      const ethereum = (window as any).ethereum;
    this.metamaskAvailable = (ethereum !== 'undefined');
    ethereum.on('accountsChanged', this.onAccountChanges.bind(this));
    ethereum.on('chainChanged', this.onChainChange.bind(this));
  }

    async onChainChange(chainId) {
      chainId = hexToNumber(chainId);
      this.metamaskChainError = false;
      const ethereum = (window as any).ethereum;
      if(this.unwrappers !== null) {
          const unwrapper = this.unwrappers.find(x => x.chainId == chainId);
          if(unwrapper != null) {
              this.metamaskNetwork = unwrapper.networkName;
              this.web3 = new Web3(ethereum);
              this.tokenContract = new this.web3.eth.Contract(this.abi, unwrapper.contractAddress);
              this.metamaskConnected = true;
              try {
                  const accounts = await ethereum.request({method: 'eth_requestAccounts'});
                  this.onAccountChanges(accounts);
                  return;
              } catch(error) {

              }

          }
      }
      this.metamaskConnected = false;
      this.metamaskChainError = true;
    }

    async onAccountChanges(accounts) {
      this.metamaskAccountAds = "?";
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

  copyInput(input: HTMLInputElement): void {
    input.select();
    document.execCommand('copy');
    input.setSelectionRange(0, 0);
  }



  selectNativeDeposit(): void {
    this.useNativeDeposit = true;
    this.useNowPaymentsDeposit = false;
    this.useWrappedDeposit = false;
  }

  selectWrappedDeposit(): void {
    this.useNativeDeposit = false;
    this.useNowPaymentsDeposit = false;
    this.useWrappedDeposit = true;
  }

  selectNowPaymentsDeposit(): void {
    this.useNativeDeposit = false;
    this.useNowPaymentsDeposit = true;
    this.useWrappedDeposit = false;
  }

  restartDepositMethod(): void {
    this.useNativeDeposit = false;
    this.useNowPaymentsDeposit = false;
    this.useWrappedDeposit = false;
  }

  validNowPaymentsAmount(amount) {
    return isNumeric(amount) && amount >= this.nowPayments.minAmount && amount <= this.nowPayments.maxAmount
  }

  setNowPaymentsAmount(amount: number) {
    this.nowPaymentsAmount = amount;
    this.nowPaymentsAdsAmount = Math.round(1e11 * (this.nowPaymentsAmount / this.nowPayments.exchangeRate));
  }

  keydownNowPaymentsAmount(event) {
    if (this.validNowPaymentsAmount(event.target.value)) {
      this.setNowPaymentsAmount(event.target.value)
    }
  }

  changeNowPaymentsAmount(event) {
    if (!this.validNowPaymentsAmount(event.target.value)) {
      this.nowPaymentsAdsAmount = null;
      this.nowPaymentsAmountError = true;
      return;
    }

    this.nowPaymentsAmountError = false;
    this.setNowPaymentsAmount(event.target.value)
  }

  async depositWrapped() {
    if(this.isFormBeingSubmitted ) return;
    this.metamaskError = null;
    this.metamaskTxid = null;
    let amount : number = parseFloat((<HTMLInputElement>document.getElementById("wrapped_amount")).value);
    if(!amount || amount > parseFloat(this.metamaskAccountAds)) {
      this.wrappedAmountError = true;
    } else {
      this.wrappedAmountError = false;
      this.isFormBeingSubmitted = true;
      try {
          const result = await this.tokenContract.methods.unwrapMessage((amount * 1e11).toFixed(0), "0x" + this.adsharesAddress.replace(new RegExp('-', 'g'), ""), "0x" + this.paymentMemo).send({from: this.metamaskAccount});
          this.metamaskTxid = result.transactionHash;
      } catch(error) {
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

    this.api.config.nowPaymentsInit(this.nowPaymentsAmount)
      .subscribe((data: NowPaymentsInit) => {
        if (data.nowPaymentsUrl) {
          window.location.href = data.nowPaymentsUrl;
        } else {
          this.isFormBeingSubmitted = false;
          this.nowPaymentsServerError = true;
        }
      });
  }
}

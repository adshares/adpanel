import {Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "auth/auth.service";

@Component({
  selector: 'app-confirm-old-change-email.component',
  templateUrl: './confirm-old-change-email.component.html',
  styleUrls: ['./confirm-old-change-email.component.scss'],
})
export class ConfirmOldChangeEmailComponent {

  token: any;
  constructor(
      private authService: AuthService,
      private router: Router,
      private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
        this.token =  params['token'];
        this.confirmOldEmail(this.token);
    });
  }

  confirmOldEmail(token){
    this.authService.confirmOldEmailChange(token).subscribe();
  }
}


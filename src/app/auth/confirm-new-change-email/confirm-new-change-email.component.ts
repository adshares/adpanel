import {Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "auth/auth.service";

@Component({
    selector: 'app-confirm-new-change-email.component',
    templateUrl: './confirm-new-change-email.component.html',
    styleUrls: ['./confirm-new-change-email.component.scss'],
})
export class ConfirmNewChangeEmailComponent {

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
            this.confirmNewEmail(this.token);
        });
    }

    confirmNewEmail(token){
        this.authService.confirmNewEmailChange(token).subscribe();
    }
}


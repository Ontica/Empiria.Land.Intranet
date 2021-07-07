/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { AuthenticationService } from '@app/core';

@Component({
  selector: 'emp-ng-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
})
export class UserLoginComponent implements OnInit {

  form = new FormGroup({
    userID: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  exceptionMsg: string;

  submitted = false;

  constructor(private authenticationService: AuthenticationService,
              private router: Router) { }


  ngOnInit() {
    this.authenticationService.logout()
        .then((x: boolean) => this.reloadPage(x));
  }


  login() {
    if (this.form.valid || !this.submitted) {
      this.authenticate();
    }
  }

  // private methods

  private authenticate() {
    this.submitted = true;

    return this.authenticationService.login(this.form.value.userID, this.form.value.password)
      .then(() => this.router.navigate(['/transactions']),
        err => this.exceptionMsg = err)
      .finally(() => this.submitted = false);
  }


  private reloadPage(mustReload: boolean) {
    if (mustReload) {
      window.location.reload();
    }
  }

}

/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot } from '@angular/router';

import { RoutesLibrary } from '../../models/permissions';

import { SessionService } from '../general/session.service';


@Injectable()
export class SecurityGuard implements CanActivate, CanActivateChild {

  constructor(private router: Router,
              private session: SessionService) { }


  canActivate() {
    return this.isAuthenticated();
  }


  canActivateChild(childRoute: ActivatedRouteSnapshot) {
    if (!this.isAuthenticated()) {
      return false;
    }

    if (!this.session.hasPermission(childRoute.data.permission)) {
      const routesValid = this.getValitRoutes();
      const defaultRoute = this.getDefaultRoute(routesValid);
      this.router.navigateByUrl(defaultRoute ?? 'unauthorized');
      return false;
    }

    return true;
  }


  private isAuthenticated() {
    const principal = this.session.getPrincipal();

    if (!principal.isAuthenticated) {
      this.router.navigateByUrl('security/login');
      return false;
    }

    return true;
  }


  private getValitRoutes() {
    const principal = this.session.getPrincipal();
    return principal.permissions ? principal.permissions.filter(x => x.startsWith('route-')) : [];
  }


  private getDefaultRoute(routesValid: string[]) {

    let defaultRoute = null;

    Object.keys(RoutesLibrary).forEach( key => {
      if (RoutesLibrary[key].parent && RoutesLibrary[key].permission === routesValid[0]) {
        defaultRoute = defaultRoute ?? RoutesLibrary[key].parent + '/' + RoutesLibrary[key].path;
      }
    });

    return defaultRoute;
  }

}

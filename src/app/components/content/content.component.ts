import { DOCUMENT } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RoleConstants } from 'src/app/constants/role-constants';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  isLoggedIn: boolean = true;
  sideNavWidth = '50px';
  expandSideNav: boolean = false;
  
  RoleConstants = RoleConstants;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.authService.subscribeAuthSubject().subscribe(result => {
      this.isLoggedIn = this.authService.isLoggedIn();
    });
  }

  hasRole(roleKey: string): boolean{
    return this.authService.hasRole(roleKey);
  }

  hasPermission(permissionKey: string): boolean{
    return this.authService.hasPermission(permissionKey);
  }

  sideMenuDetailsToggle(): void {
    if (this.sideNavWidth !== '50px') {
      this.sideNavWidth = '50px';
      this.expandSideNav = false;
    } else {
      this.sideNavWidth = '180px';
      this.expandSideNav = true;
    }
  }
}

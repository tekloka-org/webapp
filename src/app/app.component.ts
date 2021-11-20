import { Component, OnInit } from '@angular/core';
import { ResponseConstants } from './constants/response-constants';
import { ApiResponse } from './models/api-response';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  
  title = 'tekloka-org-ui';

  constructor(private authService: AuthService, private userService: UserService){}

  isLoggedIn: boolean = false;

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    if(this.isLoggedIn){
      this.userService.getLoggedInUser().subscribe((response: ApiResponse) => {
        if(response.code === ResponseConstants.USER_FOUND){
          const data = response.data as any;
          this.authService.publishLoggedInUserSubject(data.user);
          this.authService.publishRoleKeysSubject(data.roleKeys);
          this.authService.publishPermissionKeysSubject(data.permissionKeys);
        }
      });
    }  
  }
  
}

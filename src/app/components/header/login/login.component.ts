import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ResponseConstants } from 'src/app/constants/response-constants';
import { ApiResponse } from 'src/app/models/api-response';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  loginForm = new FormGroup({
    emailAddress : new FormControl('', [Validators.required, Validators.email]),
    password : new FormControl('', [Validators.required, Validators.pattern('^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[@$!%*#?&])[A-Za-z0-9@$!%*#?&]{8,}$')]),
  });

  isProcessing: boolean = false;
  
  constructor(private authService: AuthService, public dialog: MatDialog, private activatedRoute: ActivatedRoute, private router: Router,
    private translateService: TranslateService, private commonService: CommonService) { }

  ngOnInit(): void {
  }
  
  login(): void{
    if (this.loginForm.valid){
      this.isProcessing = true;
      this.authService.login(this.loginForm).subscribe((response: ApiResponse) => {
        if(response.code === ResponseConstants.LOGIN_SUCCESS){
          const data = response.data as any;
          localStorage.setItem('X_AUTH_TOKEN', data.X_AUTH_TOKEN);
          this.authService.publishAuthSubject('logged-in');
          this.authService.publishLoggedInUserSubject(data.user);
          this.authService.publishRoleKeysSubject(data.roleKeys);
          this.authService.publishPermissionKeysSubject(data.permissionKeys);
          this.dialog.getDialogById('loginDialog')!.close();
          if(this.router.url.split('?')[0] === '/process/email-verification'){
            this.router.navigate(['home']);
          }
        }else if(response.code === ResponseConstants.EMAIL_NOT_VERIFIED){
          this.commonService.displaySnackBarMessages('messages.emailNotVerified', 5000);
        }else{
          this.commonService.displaySnackBarMessages('messages.loginFailed', 5000);
        }
        this.isProcessing = false;
      });
    }
  }

}

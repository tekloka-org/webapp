import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ResponseConstants } from 'src/app/constants/response-constants';
import { ApiResponse } from 'src/app/models/api-response';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.scss']
})
export class AuthDialogComponent implements OnInit {
  tabIndex = 0;

  signUpForm = new FormGroup({
    name : new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
    emailAddress : new FormControl('', [Validators.required, Validators.email]),
    password : new FormControl('',  [Validators.required, ]),
      //Validators.pattern('^(?=.{6,})(?=.*[@#$%^&+=]).*$')]),
    confirmPassword : new FormControl('', [Validators.required])
  }, 
  //this.passwordsShouldMatch
  );

  loginForm = new FormGroup({
    emailAddress : new FormControl('', [Validators.required]),
    password : new FormControl('', [Validators.required]),
  });

  constructor(private authService: AuthService, public dialog: MatDialog,
    private snackBar: MatSnackBar,private router: Router,
    private translateService: TranslateService, private commonService: CommonService) {}

  ngOnInit(): void {
  }

  passwordsShouldMatch(formGroup: FormGroup) {
    return formGroup.get('password')?.value === formGroup.get('confirmPassword')?.value
      ? null : {'mismatch': true};
  }

  password(formGroup: FormGroup): boolean {
    // const { value: password } = formGroup.get('password');
    // const { value: confirmPassword } = formGroup.get('confirmPassword');
    const password  = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    const matched: boolean =  password === confirmPassword ;
    if (matched) {
      formGroup.controls.confirmPassword.setErrors(null);
    } else {
      formGroup.controls.confirmPassword.setErrors({
          passwordNotMatch: true
        });
    }

    return matched;
  }

  signUp(): void{

    if (this.signUpForm.valid){
     
      this.authService.signUp(this.signUpForm).subscribe((response: ApiResponse) => {
        const apiResponse = response as ApiResponse;
        if(apiResponse.code === ResponseConstants.SIGN_UP_SUCCESS){
            this.signUpForm.reset();
            let message = 'User registered';
            this.translateService.get('messages.userRegistered').subscribe((res: string) => {
              message = res;
            });
            this.commonService.displaySnackBarMessages(message, 3000);
            const signupDialog = this.dialog.getDialogById('authDialog');
            signupDialog!.componentInstance.tabIndex = 0;
        }else{
            let message = 'User registered';
            this.translateService.get('messages.userNotRegistered').subscribe((res: string) => {
              message = res;
            });
            this.commonService.displaySnackBarMessages(message, 3000);
        }
      });
    }else{
        let message = 'Invalid registration form';
        this.translateService.get('messages.invalidRegistrationForm').subscribe((res: string) => {
          message = res;
        });
        this.commonService.displaySnackBarMessages(message, 3000);
    }

  }

  login(): void{
    if (this.loginForm.valid){
      this.authService.login(this.loginForm).subscribe((response: ApiResponse) => {
        if(response.code === ResponseConstants.LOGIN_SUCCESS){
          const data = response.data as any;
          localStorage.setItem('X_AUTH_TOKEN', data.X_AUTH_TOKEN);
          this.authService.publishAuthSubject('logged-in');
          this.authService.publishLoggedInUserSubject(data.user);
          this.authService.publishRoleKeysSubject(data.roleKeys);
          this.authService.publishPermissionKeysSubject(data.permissionKeys);
          this.dialog.getDialogById('authDialog')!.close();
        }else{
          let message = 'Invalid login';
          this.translateService.get('messages.invalidLogin').subscribe((res: string) => {
            message = res;
          });
          this.commonService.displaySnackBarMessages(message, 3000);
        }
      });
    }
  }

}

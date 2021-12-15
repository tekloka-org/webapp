import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ModalConstants } from 'src/app/constants/modal-constants';
import { ResponseConstants } from 'src/app/constants/response-constants';
import { ApiResponse } from 'src/app/models/api-response';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { ModalComponent } from '../../common/modal/modal.component';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  matchPassword: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
    let password = group.get('password')?.value;
    let confirmPassword = group.get('confirmPassword')?.value;
    const matched: boolean =  password === confirmPassword ;
    if (matched) {
      group.get('confirmPassword')?.setErrors(null);
    } else {
      group.get('confirmPassword')?.setErrors({
          passwordNotMatch: true
        });
    }
    return matched ? null : { notSame: true }
  }

  signUpForm = new FormGroup({
    name : new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
    emailAddress : new FormControl('', [Validators.required, Validators.email]),
    password : new FormControl('',  [Validators.required, Validators.pattern('^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[@$!%*#?&])[A-Za-z0-9@$!%*#?&]{8,}$')]),
    confirmPassword : new FormControl('', [Validators.required])
  }, {
    validators: this.matchPassword
  });

  isProcessing: boolean = false;

  constructor(private authService: AuthService, public dialog: MatDialog, public signUpDialogRef: MatDialogRef<SignUpComponent>,
    private translateService: TranslateService, private commonService: CommonService) { }

  ngOnInit(): void {
  }

  signUp(): void{
    if (this.signUpForm.valid){
      this.isProcessing = true;
      this.authService.signUp(this.signUpForm).subscribe((response: ApiResponse) => {
        const apiResponse = response as ApiResponse;
        if(apiResponse.code === ResponseConstants.SIGN_UP_SUCCESS){
            this.signUpForm.reset();
            this.commonService.displaySnackBarMessages('messages.userRegistered', 3000);
            
            //const signupDialog = this.dialog.getDialogById('signUpDialog');
            //signupDialog?.close;
            this.signUpDialogRef.close();

            let messages = {
              title: 'messages.signUpSuccess',
              content: 'messages.signUpSuccessInfo'
            };
            const modalDialogRef = this.dialog.open(ModalComponent, {
              width: '500px',
              id: 'modalDialog',
              data: { tab: ModalConstants.INFO_MODAL, messages: messages }
           });
        }else{
            this.commonService.displaySnackBarMessages('messages.userNotRegistered', 5000);
        }
        this.isProcessing = false;
      });
    }else{
        this.commonService.displaySnackBarMessages('Invalid registration form', 5000);
    }

  }

  displayLoginPopup(){
    this.dialog.closeAll();
    this.dialog.open(LoginComponent, {
      width: '500px',
      id: 'loginDialog'
   });
  }
}


import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ModalConstants } from 'src/app/constants/modal-constants';
import { ResponseConstants } from 'src/app/constants/response-constants';
import { ApiResponse } from 'src/app/models/api-response';
import { AuthService } from 'src/app/services/auth.service';
import { AuthDialogComponent } from '../../header/auth-dialog/auth-dialog.component';
import { LoginComponent } from '../../header/login/login.component';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.scss']
})
export class ProcessComponent implements OnInit {

  action: string;
  isProcessing: boolean = false;
  actionCompleted: boolean = false;
  data: any;

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

  changePasswordForm = new FormGroup({
    emailAddress : new FormControl('', [Validators.required, Validators.email]),
    verificationKey: new FormControl('', [Validators.required]),
    password : new FormControl('',  [Validators.required, Validators.pattern('^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[@$!%*#?&])[A-Za-z0-9@$!%*#?&]{8,}$')]),
    confirmPassword : new FormControl('', [Validators.required])
  }, {
    validators: this.matchPassword
  });


  constructor(private activatedRoute: ActivatedRoute, private authService: AuthService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.action = this.activatedRoute.snapshot.params.action;
    if(this.action == 'email-verification'){
      this.emailVerificationAction();
    }else if(this.action == 'change-password'){
      let emailAddress = this.activatedRoute.snapshot.queryParams.emailAddress;
      let verificationKey = this.activatedRoute.snapshot.queryParams.verificationKey;
      this.changePasswordForm.get('emailAddress')?.setValue(emailAddress);
      this.changePasswordForm.get('verificationKey')?.setValue(verificationKey);
    }
  }

  emailVerificationAction(){
    let emailAddress = this.activatedRoute.snapshot.queryParams.emailAddress;
    let verificationKey = this.activatedRoute.snapshot.queryParams.verificationKey;
    this.authService.emailConfirmation(emailAddress, verificationKey).subscribe((response: ApiResponse) => {
      const apiResponse = response as ApiResponse;
      if(apiResponse.code === ResponseConstants.EMAIL_VERIFICATION_SUCCESS){
        this.data = {
          message: 'messages.emailVerified'
        }
        setTimeout(() => {
          this.displayLoginPopup();
       }, 2000);
      }else if(apiResponse.code === ResponseConstants.EMAIL_ALREADY_VERIFIED){
        this.data = {
          message: 'messages.emailAlreadyVerified'
        }
        setTimeout(() => {
          this.displayLoginPopup();
       }, 2000);
      }else{
        this.data = {
          message: 'messages.emailVerificationFailed'
        }
      }
    });
  }

  displayLoginPopup(){
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '500px',
     id: 'loginDialog'
   });
   
  }

  changePassword(){
    if(this.changePasswordForm.valid){
      this.isProcessing = true;
      this.authService.changePassword(this.changePasswordForm).subscribe((response: ApiResponse) => {
        if(response.code === ResponseConstants.PASSWORD_CHANGE_SUCCESS){
          this.dialog.closeAll();
          this.data = {
            message: 'messages.passwordChangeSuccess'
          }
          setTimeout(() => {
            this.displayLoginPopup();
         }, 2000);
        }else if(response.code === ResponseConstants.USER_NOT_FOUND){
          this.data = {
            message: 'messages.userNotFoundInfo'
          }
        }else if(response.code === ResponseConstants.RESET_PASSWORD_LINK_EXPIRED){
          this.data = {
            message: 'messages.resetPasswordLinkExpired'
          }
        }else if(response.code === ResponseConstants.RESET_PASSWORD_LINK_INVALID){
          this.data = {
            message: 'messages.resetPasswordLinkInvalid'
          }
        }
        this.actionCompleted = true;
        this.isProcessing = false;
      });
    }
  }

}

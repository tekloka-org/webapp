import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ResponseConstants } from 'src/app/constants/response-constants';
import { ApiResponse } from 'src/app/models/api-response';
import { AuthService } from 'src/app/services/auth.service';
import { AuthDialogComponent } from '../../header/auth-dialog/auth-dialog.component';
import { LoginComponent } from '../../header/login/login.component';

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.scss']
})
export class ProcessComponent implements OnInit {

  action: string;
  isProcessing: boolean = false;
  data: any;

  constructor(private activatedRoute: ActivatedRoute, private authService: AuthService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.action = this.activatedRoute.snapshot.params.action;
    if(this.action == 'email-verification'){
      this.emailVerificationAction();
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

}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ModalConstants } from 'src/app/constants/modal-constants';
import { ResponseConstants } from 'src/app/constants/response-constants';
import { ApiResponse } from 'src/app/models/api-response';
import { AuthService } from 'src/app/services/auth.service';
import { ModalComponent } from '../../common/modal/modal.component';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm = new FormGroup({
    emailAddress : new FormControl('', [Validators.required, Validators.email])
  });

  isProcessing: boolean = false;

  constructor(private authService: AuthService, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  resetPasswordLink(){
    if(this.forgotPasswordForm.valid){
      this.isProcessing = true;
      this.authService.resetPasswordLink(this.forgotPasswordForm).subscribe((response: ApiResponse) => {
        if(response.code === ResponseConstants.RESET_PASSWORD_LINK_GENERATED){
          this.dialog.closeAll();
          let messages = {
            title: 'messages.resetPasswordLinkGenerated',
            content: 'messages.resetPasswordLinkGeneratedInfo'
          };
          const modalDialogRef = this.dialog.open(ModalComponent, {
            width: '500px',
            id: 'modalDialog',
            data: { tab: ModalConstants.INFO_MODAL, messages: messages }
         });
        }else if(response.code === ResponseConstants.USER_NOT_FOUND){
          this.dialog.closeAll();
          let messages = {
            title: 'messages.userNotFound',
            content: 'messages.userNotFoundInfo'
          };
          const modalDialogRef = this.dialog.open(ModalComponent, {
            width: '500px',
            id: 'modalDialog',
            data: { tab: ModalConstants.INFO_MODAL, messages: messages }
         });
        }else if(response.code === ResponseConstants.EMAIL_SENDING_FAILURE){
          this.dialog.closeAll();
          let messages = {
            title: 'messages.emailSendingFailure',
            content: 'messages.emailSendingFailureInfo'
          };
          const modalDialogRef = this.dialog.open(ModalComponent, {
            width: '500px',
            id: 'modalDialog',
            data: { tab: ModalConstants.INFO_MODAL, messages: messages }
         });
        }
        this.isProcessing = false;
      });
    }
  }
}

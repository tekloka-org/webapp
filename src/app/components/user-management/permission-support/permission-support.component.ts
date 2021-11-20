import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalConstants } from 'src/app/constants/modal-constants';
import { ResponseConstants } from 'src/app/constants/response-constants';
import { ApiResponse } from 'src/app/models/api-response';
import { Permission } from 'src/app/models/permission';
import { CommonService } from 'src/app/services/common.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-permission-support',
  templateUrl: './permission-support.component.html',
  styleUrls: ['./permission-support.component.scss']
})
export class PermissionSupportComponent implements OnInit {

  ADD_PERMISSION_MODAL = ModalConstants.ADD_PERMISSION_MODAL;
  UPDATE_PERMISSION_MODAL = ModalConstants.UPDATE_PERMISSION_MODAL;
  DELETE_PERMISSION_MODAL = ModalConstants.DELETE_PERMISSION_MODAL;

  addForm = new FormGroup({
    name : new FormControl('', [Validators.required]),
    code : new FormControl('', [Validators.required])
  });

  updateForm = new FormGroup({
    permissionId: new FormControl('', [Validators.required]),
    name : new FormControl('', [Validators.required]),
    code : new FormControl('', [Validators.required])
  });

  deleteForm = new FormGroup({
    permissionId: new FormControl('', [Validators.required]),
    name : new FormControl('', [Validators.required]),
    code : new FormControl('', [Validators.required])
  });

  selectedPermission: Permission;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any, 
              private userService: UserService, private commonService: CommonService,
              private dialogRef: MatDialogRef<PermissionSupportComponent>) { }

  ngOnInit(): void {
    
    this.selectedPermission = this.dialogData.messages?.permission;
    if(this.dialogData.tab === this.UPDATE_PERMISSION_MODAL){
      this.updateForm.get('permissionId')?.setValue(this.selectedPermission?.permissionId);
      this.updateForm.get('name')?.setValue(this.selectedPermission?.name);
      this.updateForm.get('code')?.setValue(this.selectedPermission?.code);
    }

    if(this.dialogData.tab === this.DELETE_PERMISSION_MODAL){
      this.deleteForm.get('permissionId')?.setValue(this.selectedPermission?.permissionId);
      this.deleteForm.get('name')?.setValue(this.selectedPermission?.name);
      this.deleteForm.get('code')?.setValue(this.selectedPermission?.code);
    }

  }

  save(){
    if(this.addForm.valid){
      this.userService.savePermission(this.addForm).subscribe((response: ApiResponse) => {
        if(response.code === ResponseConstants.PERMISSION_SAVED){
          const data = response.data as any;
          this.commonService.displaySnackBarMessages('added', 3000);
          this.dialogRef.close({ code: ResponseConstants.PERMISSION_SAVED, permission: data.permission });
        }
      });
    }
  }

  update(){
    if(this.updateForm.valid){
      this.userService.updatePermission(this.updateForm).subscribe((response: ApiResponse) => {
        if(response.code === ResponseConstants.PERMISSION_UPDATED){
          const data = response.data as any;
          this.commonService.displaySnackBarMessages('updated', 3000);
          this.dialogRef.close({ code: ResponseConstants.PERMISSION_UPDATED, permission: data.permission });
        }
      });
    }
  }

  delete(){
    if(this.deleteForm.valid){
      this.userService.deletePermisson(this.deleteForm).subscribe((response: ApiResponse) => {
        if(response.code === ResponseConstants.PERMISSION_DELETED){
          this.commonService.displaySnackBarMessages('deleted', 3000);
          this.dialogRef.close({ code: ResponseConstants.PERMISSION_DELETED});
        }
      });
    }
  }

}

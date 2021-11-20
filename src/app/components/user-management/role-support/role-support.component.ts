import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseConstants } from 'src/app/constants/response-constants';
import { ApiResponse } from 'src/app/models/api-response';
import { Permission } from 'src/app/models/permission';
import { Role } from 'src/app/models/role';
import { CommonService } from 'src/app/services/common.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-role-support',
  templateUrl: './role-support.component.html',
  styleUrls: ['./role-support.component.scss']
})
export class RoleSupportComponent implements OnInit {

  addForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    code: new FormControl('', [Validators.required]),
    permissions: new FormArray([])
  });

  updateForm = new FormGroup({
    roleId: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    code: new FormControl('', [Validators.required]),
    permissions: new FormArray([])
  });

  deleteForm = new FormGroup({
    roleId: new FormControl('', [Validators.required])
  });

  selectedRoleCode: string;
  selectedRole: Role = new Role();
  displayForm: string;

  allPermissions: Permission[];

  dataSource:  MatTableDataSource<any>;
  displayedColumns: string[] ;
  @ViewChild(MatSort) sort: MatSort;
  selectedObjects = new SelectionModel<Permission>(true, []);

  constructor(private userService: UserService, private commonService: CommonService,
    private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    //this.displayedColumns = [ 'select', 'name', 'code'];
    this.displayedColumns = [ 'select', 'name', 'code' ];
    //Setting the display form
    const supportPageURL = this.router.url;
    if (this.router.url.includes('add-role')) {
      this.displayForm = 'ADD_FORM'
    }else if(supportPageURL.includes('update-role')){
      this.displayForm = 'UPDATE_FORM';
    }else if(supportPageURL.includes('delete-role')){
      this.displayForm = 'DELETE_FORM';
    }
    
    //validating role code in url
    if(supportPageURL.includes('update-role') || supportPageURL.includes('delete-role')) {
      this.activatedRoute.params.subscribe(params => {
        this.selectedRoleCode = params['role-code'];
        var roleParam = this.userService.getSelectedRole() as Role;
        if(roleParam === null || roleParam === undefined || roleParam.code !== this.selectedRoleCode){
          this.userService.getRole(this.selectedRoleCode).subscribe((response: ApiResponse) => {
            if (response.code === ResponseConstants.ROLE_FOUND) {
              const data = response.data as any;
              this.selectedRole = data.role;
              this.setFormValues(this.selectedRole);              
            }
          });
        }else{
          this.selectedRole = roleParam;
          this.setFormValues(this.selectedRole);
        }
      });
    }

    //Getting all permissions
    this.userService.getAllPermissions().subscribe((response: ApiResponse) => {
      if(response.code === ResponseConstants.PERMISSION_LIST_FOUND){
        const data = response.data as any;
        this.allPermissions = data.permissionList as Permission[];
        this.dataSource = new MatTableDataSource(this.allPermissions);
        this.dataSource.sortingDataAccessor = (obj, property) => this.getProperty(obj, property);
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = (data: any, filter) => {
          const dataStr =JSON.stringify(data).toLowerCase();
          return dataStr.indexOf(filter) != -1;
        }

        //Adding already assigned permission to SelectionModel
        this.selectedObjects = new SelectionModel<Permission>(true, this.allPermissions.filter(p => {
            let exists = false;
            if(this.selectedRole?.permissions?.length > 0){
              for(let assignedPermission of this.selectedRole.permissions) {
                if(p.permissionId === assignedPermission.permissionId){
                  exists = true;
                  break;
                } 
              }
            }
            return exists;
          })
        );
      }
    });

  }

  getProperty = (obj: any, path: string) => (
    path.split('.').reduce((o, p) => o && o[p], obj)
  )

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  setFormValues(selectedRole: Role) {
    this.updateForm.get('roleId')?.setValue(selectedRole.roleId);
    this.updateForm.get('name')?.setValue(selectedRole.name);
    this.updateForm.get('code')?.setValue(selectedRole.code);
    this.deleteForm.get('roleId')?.setValue(selectedRole.roleId);
  }

  save() {
    if (this.addForm.valid) {
      this.selectedObjects.selected.forEach((value) => {
        const control = new FormControl(value, Validators.required);
        (<FormArray>this.addForm.get('permissions')).push(control);
      });
      this.userService.saveRole(this.addForm).subscribe((response: ApiResponse) => {
        if (response.code === ResponseConstants.ROLE_SAVED) {
          this.commonService.displaySnackBarMessages('added', 3000);
          this.router.navigate(['user-management','role-list']);
        }
      });
    }
  }

  update() {
    if (this.updateForm.valid) {
      this.selectedObjects.selected.forEach((value) => {
        const control = new FormControl(value, Validators.required);
        (<FormArray>this.updateForm.get('permissions')).push(control);
      });
      this.userService.updateRole(this.updateForm).subscribe((response: ApiResponse) => {
        if (response.code === ResponseConstants.ROLE_UPDATED) {
          const data = response.data as any;
          this.commonService.displaySnackBarMessages('updated', 3000);
          this.router.navigate(['user-management','role-list']);
        }
      });
    }
  }

  delete() {
    if (this.deleteForm.valid) {
      this.userService.deleteRole(this.deleteForm).subscribe((response: ApiResponse) => {
        if (response.code === ResponseConstants.ROLE_DELETED) {
          this.commonService.displaySnackBarMessages('deleted', 3000);
          this.router.navigate(['user-management','role-list']);
        }
      });
    }
  }


  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selectedObjects.selected.length;
    const numRows = this.dataSource?.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selectedObjects.clear();
      return;
    }

    this.selectedObjects.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Permission): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selectedObjects.isSelected(row) ? 'deselect' : 'select'} row ${row.permissionId}`;
  }
  
}

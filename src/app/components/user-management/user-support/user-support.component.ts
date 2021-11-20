import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseConstants } from 'src/app/constants/response-constants';
import { ApiResponse } from 'src/app/models/api-response';
import { Role } from 'src/app/models/role';
import { User } from 'src/app/models/user';
import { CommonService } from 'src/app/services/common.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-support',
  templateUrl: './user-support.component.html',
  styleUrls: ['./user-support.component.scss']
})
export class UserSupportComponent implements OnInit {

  addForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    emailAddress: new FormControl('', [Validators.required]),
    roles: new FormArray([])
  });

  updateForm = new FormGroup({
    userId: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    emailAddress: new FormControl('', [Validators.required]),
    roles: new FormArray([])
  });

  deleteForm = new FormGroup({
    userId: new FormControl('', [Validators.required])
  });

  selectedEmailAddress: string;
  selectedUser: User = new User();
  displayForm: string;

  allRoles: Role[];

  dataSource:  MatTableDataSource<any>;
  displayedColumns: string[] ;
  @ViewChild(MatSort) sort: MatSort;
  selectedObjects = new SelectionModel<Role>(true, []);

  constructor(private userService: UserService, private commonService: CommonService,
    private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.displayedColumns = [ 'select', 'name', 'code' ];
    
    //Setting the display form
    const supportPageURL = this.router.url;
    if (this.router.url.includes('add-user')) {
      this.displayForm = 'ADD_FORM'
    }else if(supportPageURL.includes('update-user')){
      this.displayForm = 'UPDATE_FORM';
    }else if(supportPageURL.includes('delete-user')){
      this.displayForm = 'DELETE_FORM';
    }
    
    //validating email address in url
    if(supportPageURL.includes('update-user') || supportPageURL.includes('delete-user')) {
      this.activatedRoute.params.subscribe(params => {
        this.selectedEmailAddress = params['email-address'];
        var userParam = this.userService.getSelectedUser() as User;
        if(userParam === null || userParam === undefined || userParam.emailAddress !== this.selectedEmailAddress){
          this.userService.getUser(this.selectedEmailAddress).subscribe((response: ApiResponse) => {
            if (response.code === ResponseConstants.USER_FOUND) {
              const data = response.data as any;
              this.selectedUser = data.user;
              this.setFormValues(this.selectedUser);              
            }
          });
        }else{
          this.selectedUser = userParam;
          this.setFormValues(this.selectedUser);
        }
      });
    }

    //Getting all permissions
    this.userService.getAllRoles().subscribe((response: ApiResponse) => {
      if(response.code === ResponseConstants.ROLE_LIST_FOUND){
        const data = response.data as any;
        this.allRoles = data.roleList as Role[];
        this.dataSource = new MatTableDataSource(this.allRoles);
        this.dataSource.sortingDataAccessor = (obj, property) => this.getProperty(obj, property);
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = (data: any, filter) => {
          const dataStr =JSON.stringify(data).toLowerCase();
          return dataStr.indexOf(filter) != -1;
        }

        //Adding already assigned permission to SelectionModel
        this.selectedObjects = new SelectionModel<Role>(true, this.allRoles.filter(p => {
            let exists = false;
            if(this.selectedUser?.roles?.length > 0){
              for(let assignedRole of this.selectedUser.roles) {
                if(p.roleId === assignedRole.roleId){
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

  setFormValues(selectedUser: User) {
    this.updateForm.get('userId')?.setValue(selectedUser.userId);
    this.updateForm.get('name')?.setValue(selectedUser.name);
    this.updateForm.get('emailAddress')?.setValue(selectedUser.emailAddress);
    this.deleteForm.get('userId')?.setValue(selectedUser.userId);
  }

  save() {
    if (this.addForm.valid) {
      this.selectedObjects.selected.forEach((value) => {
        const control = new FormControl(value, Validators.required);
        (<FormArray>this.addForm.get('roles')).push(control);
      });
      this.userService.saveUser(this.addForm).subscribe((response: ApiResponse) => {
        if (response.code === ResponseConstants.USER_SAVED) {
          this.commonService.displaySnackBarMessages('added', 3000);
          this.router.navigate(['user-management','user-list']);
        }
      });
    }
  }

  update() {
    if (this.updateForm.valid) {
      this.selectedObjects.selected.forEach((value) => {
        const control = new FormControl(value, Validators.required);
        (<FormArray>this.updateForm.get('roles')).push(control);
      });
      this.userService.updateUser(this.updateForm).subscribe((response: ApiResponse) => {
        if (response.code === ResponseConstants.USER_UPDATED) {
          const data = response.data as any;
          this.commonService.displaySnackBarMessages('updated', 3000);
          this.router.navigate(['user-management','user-list']);
        }
      });
    }
  }

  delete() {
    if (this.deleteForm.valid) {
      this.userService.deleteUser(this.deleteForm).subscribe((response: ApiResponse) => {
        if (response.code === ResponseConstants.USER_DELETED) {
          this.commonService.displaySnackBarMessages('deleted', 3000);
          this.router.navigate(['user-management','user-list']);
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
  checkboxLabel(row?: Role): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selectedObjects.isSelected(row) ? 'deselect' : 'select'} row ${row.roleId}`;
  }

}

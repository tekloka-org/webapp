import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ModalConstants } from 'src/app/constants/modal-constants';
import { ResponseConstants } from 'src/app/constants/response-constants';
import { ApiResponse } from 'src/app/models/api-response';
import { Permission } from 'src/app/models/permission';
import { CommonService } from 'src/app/services/common.service';
import { UserService } from 'src/app/services/user.service';
import { PermissionSupportComponent } from '../permission-support/permission-support.component';

@Component({
  selector: 'app-permission-list',
  templateUrl: './permission-list.component.html',
  styleUrls: ['./permission-list.component.scss']
})
export class PermissionListComponent implements OnInit {

  dataSource:  MatTableDataSource<any>;
  displayedColumns: string[] ;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  constructor(private router: Router, private userService: UserService,
    private commonService: CommonService, private translateService: TranslateService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.displayedColumns = [ 'name', 'code', 'actions'];
    this.userService.getAllPermissions().subscribe((response: ApiResponse) => {
      if(response.code === ResponseConstants.PERMISSION_LIST_FOUND){
        const data = response.data as any;
        this.dataSource = new MatTableDataSource(data.permissionList);
        this.dataSource.sortingDataAccessor = (obj, property) => this.getProperty(obj, property);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = (data: any, filter) => {
          const dataStr =JSON.stringify(data).toLowerCase();
          return dataStr.indexOf(filter) != -1;
        }
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

  displayAddPage(){
    let messages = {
      title: 'Add Permission'
    };
    this.translateService.get('permission.add').subscribe((res: string) => {
      messages.title = res;
    });
    const dialogRef = this.dialog.open(PermissionSupportComponent, {
      width: '500px',
      id: 'add-permission-modal',
      data: { tab: ModalConstants.ADD_PERMISSION_MODAL, messages: messages }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result?.code === ResponseConstants.PERMISSION_SAVED) {
        const data = this.dataSource.data;
        data.unshift(result.permission);
        this.dataSource.data = data;
      }
    });   
  }

  displayUpdatePage(index: number, permission: Permission){
    let messages = {
      title: 'Update Permission',
      permission: permission
    };
    this.translateService.get('permission.update').subscribe((res: string) => {
      messages.title = res;
    });
    const dialogRef = this.dialog.open(PermissionSupportComponent, {
      width: '500px',
      id: 'update-permission-modal',
      data: { tab: ModalConstants.UPDATE_PERMISSION_MODAL, messages: messages }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result?.code === ResponseConstants.PERMISSION_UPDATED) {
        const data = this.dataSource.data;
        data[index] = result.permission;
        this.dataSource.data = data;
      }
    });
  }

  displayDeletePage(index: number, permission: Permission){
    let messages = {
      title: 'Delete Permission',
      permission: permission
    };
    this.translateService.get('category.delete').subscribe((res: string) => {
      messages.title = res;
    });
    const dialogRef = this.dialog.open(PermissionSupportComponent, {
      width: '500px',
      id: 'delete-permission-modal',
      data: { tab: ModalConstants.DELETE_PERMISSION_MODAL, messages: messages }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result?.code === ResponseConstants.PERMISSION_DELETED) {
        const data = this.dataSource.data;
        data.splice(index, 1);
        this.dataSource.data = data;
      }
    });
  }

}

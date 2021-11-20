import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ResponseConstants } from 'src/app/constants/response-constants';
import { ApiResponse } from 'src/app/models/api-response';
import { Role } from 'src/app/models/role';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit {

  dataSource:  MatTableDataSource<any>;
  displayedColumns: string[] ;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  constructor(private router: Router, private userService: UserService, private translateService: TranslateService) { }

  ngOnInit(): void {
    this.displayedColumns = [ 'name', 'code', 'rolePermissions', 'actions'];
    this.userService.getAllRoles().subscribe((response: ApiResponse) => {
      if(response.code === ResponseConstants.ROLE_LIST_FOUND){
        const data = response.data as any;
        this.dataSource = new MatTableDataSource(data.roleList);
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
    this.router.navigate(['user-management', 'add-role']);
  }

  displayUpdatePage(role: Role){
    this.userService.setSelectedRole(role);
    this.router.navigate(['user-management', 'update-role', role.code]);
  }

  displayDeletePage(role: Role){
    this.userService.setSelectedRole(role);
    this.router.navigate(['user-management', 'delete-role', role.code]);
  }

  getPermissions(role: Role): string{
    let permissions = '';
      role.permissions?.forEach(e => {
        permissions = permissions + e.name + '\n';
      });
    return permissions;
  }


}

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ResponseConstants } from 'src/app/constants/response-constants';
import { ApiResponse } from 'src/app/models/api-response';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  dataSource:  MatTableDataSource<any>;
  displayedColumns: string[] ;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  constructor(private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    this.displayedColumns = [ 'name', 'emailAddress', 'userRoles', 'actions'];
    this.userService.getAllUsers().subscribe((response: ApiResponse) => {
      if(response.code === ResponseConstants.USER_LIST_FOUND){
        const data = response.data as any;
        this.dataSource = new MatTableDataSource(data.userList);
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
    this.router.navigate(['user-management', 'add-user']);
  }

  displayUpdatePage(user: User){
    this.userService.setSelectedUser(user);
    this.router.navigate(['user-management', 'update-user', user.emailAddress]);
  }

  displayDeletePage(user: User){
    this.userService.setSelectedUser(user);
    this.router.navigate(['user-management', 'delete-user', user.emailAddress]);
  }

  getRoles(user: User): string{
    let roles = '';
      user.roles?.forEach(e => {
        roles = roles + e.name + '\n';
      });
    return roles;
  }

}

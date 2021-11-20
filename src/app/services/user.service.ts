import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiConstants } from '../constants/api-constants';
import { Role } from '../models/role';
import { User } from '../models/user';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private commonService: CommonService) { }

  setSelectedRole(role: Role): void{
    sessionStorage.setItem('selectedRole', JSON.stringify(role));
  }

  getSelectedRole(): any{
    const value =  sessionStorage.getItem('selectedRole');
    if(value !== null && value !== undefined){
      const selectedRole = JSON.parse(value);
      return selectedRole;
    }else{
      return null;
    }
  }

  setSelectedUser(user: User): void{
    sessionStorage.setItem('selectedUser', JSON.stringify(user));
  }

  getSelectedUser(): any{
    const value =  sessionStorage.getItem('selectedUser');
    if(value !== null && value !== undefined){
      const selectedUser = JSON.parse(value);
      return selectedUser;
    }else{
      return null;
    }
  }

  savePermission(form: any): any {
    return this.http.post(environment.apiUrl + ApiConstants.SAVE_PERMISSION,
            form.value, {headers: this.commonService.getEmptyHeaders()});
  }

  updatePermission(form: any): any {
    return this.http.post(environment.apiUrl + ApiConstants.UPDATE_PERMISSION,
            form.value, {headers: this.commonService.getEmptyHeaders()});
  }

  deletePermisson(form: any): any {
    return this.http.post(environment.apiUrl + ApiConstants.DELETE_PERMISSION,
            form.value, {headers: this.commonService.getEmptyHeaders()});
  }

  getAllPermissions(): any {
    return this.http.get(environment.apiUrl + ApiConstants.GET_ALL_PERMISSIONS);
  }

  saveRole(form: any): any {
    return this.http.post(environment.apiUrl + ApiConstants.SAVE_ROLE,
            form.value, {headers: this.commonService.getEmptyHeaders()});
  }

  updateRole(form: any): any {
    return this.http.post(environment.apiUrl + ApiConstants.UPDATE_ROLE,
            form.value, {headers: this.commonService.getEmptyHeaders()});
  }

  deleteRole(form: any): any {
    return this.http.post(environment.apiUrl + ApiConstants.DELETE_ROLE,
            form.value, {headers: this.commonService.getEmptyHeaders()});
  }

  getAllRoles(): any {
    return this.http.get(environment.apiUrl + ApiConstants.GET_ALL_ROLES);
  }

  getRole(roleCode: any): any {
    var path = environment.apiUrl + ApiConstants.GET_ROLE;
    path = path.replace('{roleCode}', roleCode);
    return this.http.get(path);
  }

  saveUser(form: any): any {
    return this.http.post(environment.apiUrl + ApiConstants.SAVE_USER,
            form.value, {headers: this.commonService.getEmptyHeaders()});
  }

  updateUser(form: any): any {
    return this.http.post(environment.apiUrl + ApiConstants.UPDATE_USER,
            form.value, {headers: this.commonService.getEmptyHeaders()});
  }

  deleteUser(form: any): any {
    return this.http.post(environment.apiUrl + ApiConstants.DELETE_USER,
            form.value, {headers: this.commonService.getEmptyHeaders()});
  }

  getAllUsers(): any {
    return this.http.get(environment.apiUrl + ApiConstants.GET_ALL_USERS);
  }

  getUser(userId: any): any {
    var path = environment.apiUrl + ApiConstants.GET_USER;
    path = path.replace('{userId}', userId);
    return this.http.get(path);
  }
  
  getLoggedInUser(): any {
    return this.http.get(environment.apiUrl + ApiConstants.GET_LOGGED_IN_USER);
  }

}

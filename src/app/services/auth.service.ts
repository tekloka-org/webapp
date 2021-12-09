import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiConstants } from '../constants/api-constants';
import { DataConstants } from '../constants/data-constants';
import { RoleConstants } from '../constants/role-constants';
import { User } from '../models/user';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authSubject = new Subject<any>();
  loggedInUserSubject = new BehaviorSubject<User>(new User());
  roleKeysSubject = new BehaviorSubject<string[]>([]);
  permissionKeysSubject = new BehaviorSubject<string[]>([]);

  constructor(private http: HttpClient, private commonService: CommonService) { }

  publishAuthSubject(message: string): void {
    this.authSubject.next({ text: message });
  }

  subscribeAuthSubject(): Observable<any> {
    return this.authSubject.asObservable();
  }

  publishLoggedInUserSubject(user: User): void {
    this.loggedInUserSubject.next(user);
  }

  subscribeLoggedInUserSubject(): Observable<any> {
    return this.loggedInUserSubject.asObservable();
  }

  publishRoleKeysSubject(roleKeys: string[]): void {
    this.roleKeysSubject.next(roleKeys);
  }

  subscribeRoleKeysSubject(): Observable<any> {
    return this.roleKeysSubject.asObservable();
  }

  publishPermissionKeysSubject(permissionKeys: string[]): void {
    this.permissionKeysSubject.next(permissionKeys);
  }

  subscribePermissionKeysSubject(): Observable<any> {
    return this.permissionKeysSubject.asObservable();
  }

  getAuthTokenData(): any{
    const X_AUTH_TOKEN = localStorage.getItem(DataConstants.X_AUTH_TOKEN);
    if (X_AUTH_TOKEN !== null){
      const tokenData = JSON.parse(atob(X_AUTH_TOKEN.split('.')[1]));
      return tokenData;
    }else{
      return null;
    }
  }

  setAuthTokenData(authToken: string){
    if(authToken !== null && authToken !== undefined && authToken !== ''){
      localStorage.setItem(DataConstants.X_AUTH_TOKEN, authToken);
    }
  }

  isLoggedIn(): boolean{
    const TOKEN_DATA = this.getAuthTokenData();
    if (TOKEN_DATA !== null && TOKEN_DATA !== undefined){
      let expiry = TOKEN_DATA.exp;
      let currentDate = new Date();
      let expiryDate = new Date(0);
      expiryDate.setUTCSeconds(expiry);
      if(currentDate < expiryDate){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  }

  signUp(form: any): any {
    return this.http.post(environment.apiUrl + ApiConstants.SIGN_UP_PATH,
            form.value, {headers: this.commonService.getEmptyHeaders()});
  }

  emailConfirmation(emailAddress: string, verificationKey: string): any {
    var path = environment.apiUrl + ApiConstants.EMAIL_VERIFICATION;
    path = path.replace('{emailAddress}', emailAddress);
    path = path.replace('{verificationKey}', verificationKey);
    return this.http.get(path);
  }

  login(form: any): any {
    return this.http.post(environment.apiUrl + ApiConstants.LOGIN_PATH,
            form.value, {headers: this.commonService.getEmptyHeaders()});
  }

  hasPermission(permissionKey: string): boolean {
    let authorized = false;
    let roleKeys = this.roleKeysSubject.value as string[];
    let permissionKeys = this.permissionKeysSubject.value as string[];
    if(roleKeys?.includes(RoleConstants.SUPER_ADMIN) || permissionKeys?.includes(permissionKey)){
      authorized = true;
    }
    return authorized;
  }

  hasRole(roleKey: string): boolean {
    let authorized = false;
    let roleKeys = this.roleKeysSubject.value as string[];
    if(roleKeys?.includes(roleKey)){
      authorized = true;
    }
    return authorized;
  }
}

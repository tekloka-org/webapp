import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ResponseConstants } from 'src/app/constants/response-constants';
import { ApiResponse } from 'src/app/models/api-response';
import { Category } from 'src/app/models/category';
import { PageLink } from 'src/app/models/page-link';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/category.service';
import { AuthDialogComponent } from './auth-dialog/auth-dialog.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isLoggedIn: boolean = false;
  categories: Category[];
  loggedInUser: User;

  constructor(public dialog: MatDialog, private authService: AuthService,
    private router: Router, private categoryService: CategoryService) { }

  ngOnInit(): void {

    this.isLoggedIn = this.authService.isLoggedIn();
    this.authService.subscribeAuthSubject().subscribe(result => {
      this.isLoggedIn = this.authService.isLoggedIn();
    });

    this.authService.subscribeLoggedInUserSubject().subscribe(result => {
      this.loggedInUser = result;
    });

    this.categoryService.getAllCategories().subscribe((response: ApiResponse) => {
      if(response.code === ResponseConstants.CATEGORY_LIST_FOUND){
        const data = response.data as any;
        this.categories = data.categoryList as Category[];
      }
    });
  }

  displayRegisterPopup(){
    const signUpDialogRef = this.dialog.open(SignUpComponent, {
       width: '500px',
       id: 'signUpDialog'
    });
    //loginDialogRef.componentInstance.tabIndex = 1;
  }
  
  displayLoginPopup(){
    const loginDialogRef = this.dialog.open(LoginComponent, {
      width: '500px',
      id: 'loginDialog'
   });
   //loginDialogRef.componentInstance.tabIndex = 0;
  }

  logout(): void{
    localStorage.clear();
    this.authService.publishAuthSubject('logged-out');
    this.router.navigate(['home']);
  }

  navigateToCategoryPages(category: Category){
    this.categoryService.getCategoryPageLinks(category.urlPath).subscribe((response: ApiResponse) => {
      if(response.code === ResponseConstants.CATEGORY_PAGE_LINKS_FOUND){
        const data = response.data as any;
        var pageLinks = data.pageLinkList as PageLink[];
        if(pageLinks.length > 0){
          this.router.navigate(['category', category.urlPath, pageLinks[0]?.urlPath]);
        }else{
          this.router.navigate(['category', category.urlPath, 'add-page']);
        }
        
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ResponseConstants } from 'src/app/constants/response-constants';
import { ApiResponse } from 'src/app/models/api-response';
import { Page } from 'src/app/models/page';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/category.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-page-support',
  templateUrl: './page-support.component.html',
  styleUrls: ['./page-support.component.scss']
})
export class PageSupportComponent implements OnInit {
  
  addForm = new FormGroup({
    title : new FormControl('', [Validators.required]),
    //shortTitle : new FormControl('', [Validators.required]),
    urlPath : new FormControl('', [Validators.required]),
    content : new FormControl('', [Validators.required]),
    categoryUrlPath : new FormControl('', [Validators.required])
  });

  updateForm = new FormGroup({
    pageId : new FormControl('', [Validators.required]),
    title : new FormControl('', [Validators.required]),
    //shortTitle : new FormControl('', [Validators.required]),
    urlPath : new FormControl('', [Validators.required]),
    content : new FormControl('', [Validators.required]),
    categoryUrlPath : new FormControl('')
  });

  deleteForm = new FormGroup({
    pageId: new FormControl('', [Validators.required])
  });

  displayForm: string;

  editorConfig: AngularEditorConfig;
  selectedPageUrlPath: string;
  categoryUrlPath: string;
  selectedPage: Page;
  loggedInUser: User;

  constructor(private categoryService: CategoryService, private activatedRoute: ActivatedRoute,
    private commonService: CommonService, private router: Router, private authService: AuthService) { }
  
  ngOnInit(): void {
    
    if(this.authService.isLoggedIn()){
      this.authService.subscribeLoggedInUserSubject().subscribe(result => {
        this.loggedInUser = this.authService.loggedInUserSubject.value as User;
        this.addForm.get('authorId')?.setValue(this.loggedInUser.userId);
      });
    }

    this.editorConfig = this.commonService.editorConfig;
    this.activatedRoute.parent?.params.subscribe(params => {
      this.categoryUrlPath = params['category-url-path'];
      this.addForm.get('categoryUrlPath')?.setValue(this.categoryUrlPath);
    });

    const supportPageURL = this.router.url;
    if (supportPageURL.includes('add-page')) {
      this.displayForm = 'ADD_FORM'
    }else if(supportPageURL.includes('update-page')){
      this.displayForm = 'UPDATE_FORM';
    }else if(supportPageURL.includes('delete-page')){
      this.displayForm = 'DELETE_FORM';
    }

    //validating role code in url
    if(supportPageURL.includes('update-page') || supportPageURL.includes('delete-page')) {
      this.activatedRoute.params.subscribe(params => {
        this.selectedPageUrlPath = params['page-url-path'];
        this.categoryService.getCategoryPage(this.categoryUrlPath, this.selectedPageUrlPath).subscribe((response: ApiResponse) => {
          if(response.code === ResponseConstants.PAGE_FOUND){
            const data = response.data as any;
            this.selectedPage = data.page;
            this.setFormValues(this.selectedPage);
          }
        });
      });
    }

  }

  setFormValues(selectedPage: Page) {    
    this.updateForm.get('pageId')?.setValue(selectedPage.pageId);
    this.updateForm.get('title')?.setValue(selectedPage.title);
   // this.updateForm.get('shortTitle')?.setValue(selectedPage.shortTitle);
    this.updateForm.get('urlPath')?.setValue(selectedPage.urlPath);
    this.updateForm.get('content')?.setValue(selectedPage.content);
    this.updateForm.get('categoryUrlPath')?.setValue(this.categoryUrlPath);
    this.deleteForm.get('pageId')?.setValue(selectedPage.pageId);
  }

  save() {
    if (this.addForm.valid) {
      this.categoryService.savePage(this.addForm).subscribe((response: ApiResponse) => {
        if (response.code === ResponseConstants.PAGE_SAVED) {
          const data = response.data as any;
          this.commonService.displaySnackBarMessages('added', 3000);
          this.router.navigate(['category', this.categoryUrlPath, 'page', data.page.urlPath]);
        }
      });
    }
  }

  update() {
    if (this.updateForm.valid) {
      this.categoryService.updatePage(this.updateForm).subscribe((response: ApiResponse) => {
        if (response.code === ResponseConstants.PAGE_UPDATED) {
          const data = response.data as any;
          this.commonService.displaySnackBarMessages('updated', 3000);
          this.router.navigate(['category', this.categoryUrlPath, 'page', data.page.urlPath]);
        }
      });
    }
  }

  delete() {
    if (this.deleteForm.valid) {
      this.categoryService.deletePage(this.deleteForm).subscribe((response: ApiResponse) => {
        if (response.code === ResponseConstants.PAGE_DELETED) {
          this.commonService.displaySnackBarMessages('deleted', 3000);
          this.router.navigate(['category', this.categoryUrlPath]);
        }
      });
    }
  }

  setAddFormURLPath(){
    let title = this.addForm.get('title')?.value;
    let url = this.formatURL(title);
    this.addForm.get('urlPath')?.setValue(url);
  }

  setUpdateFormURLPath(){
    let title = this.updateForm.get('title')?.value;
    let url = this.formatURL(title);
    this.updateForm.get('urlPath')?.setValue(url);
  }

  formatURL(title: string): string{
    return this.commonService.formatURL(title);
  }

}

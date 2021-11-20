import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionConstants } from 'src/app/constants/permission-constants';
import { ResponseConstants } from 'src/app/constants/response-constants';
import { RoleConstants } from 'src/app/constants/role-constants';
import { ApiResponse } from 'src/app/models/api-response';
import { PageLink } from 'src/app/models/page-link';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/category.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.component.html',
  styleUrls: ['./category-details.component.scss']
})
export class CategoryDetailsComponent implements OnInit {

  pageLinks: PageLink[];
  categoryUrlPath: string;
  selectedPageIndex: number = 0;

  roleKeys: string[] = [];
  permissionKeys: string[] = [];
  
  RoleConstants = RoleConstants;
  PermissionConstants = PermissionConstants;

  constructor(private categoryService: CategoryService, private activatedRoute: ActivatedRoute,
    private router: Router, private authService: AuthService, private commonService: CommonService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.categoryUrlPath = params['category-url-path'];
      this.categoryService.getCategoryPageLinks(this.categoryUrlPath).subscribe((response: ApiResponse) => {
        if(response.code === ResponseConstants.CATEGORY_PAGE_LINKS_FOUND){
          const data = response.data as any;
          this.pageLinks = data.pageLinkList as PageLink[];
        }
      });
    });

    this.authService.subscribeRoleKeysSubject().subscribe(result => {
      this.roleKeys = result;
    });
    this.authService.subscribePermissionKeysSubject().subscribe(result => {
      this.permissionKeys = result;
    });
  }

  navigateToPage(pageUrlPath: string, index: number){
    this.selectedPageIndex = index;
    this.router.navigate(['category', this.categoryUrlPath, pageUrlPath]);
  }

  displayAddPage(){
    this.router.navigate(['category', this.categoryUrlPath, 'add-page']);
  }

  displayUpdatePage(pageLink: PageLink){
    this.router.navigate(['category', this.categoryUrlPath, 'update-page', pageLink.urlPath]);
  }

  displayDeletePage(pageLink: PageLink){
    this.router.navigate(['category', this.categoryUrlPath, 'delete-page', pageLink.urlPath]);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.pageLinks, event.previousIndex, event.currentIndex);
    console.log(JSON.stringify(this.pageLinks));
    this.categoryService.updatePageLinks(this.pageLinks).subscribe((response: ApiResponse) => {
      if(response.code === ResponseConstants.PAGE_LINKS_UPDATED){
        //this.commonService.displaySnackBarMessages('Page Links updated', 3000);
      }
    });
  }

  hasRole(key: string): boolean{
    return this.roleKeys?.includes(key);
  }

  hasPermission(key: string): boolean{
    return this.permissionKeys?.includes(key);
  }

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiConstants } from '../constants/api-constants';
import { PageLink } from '../models/page-link';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient, private commonService: CommonService) { }

  getAllCategories(): any {
    return this.http.get(environment.apiUrl + ApiConstants.GET_ALL_CATEGORIES);
  }

  getCategoryPageLinks(categoryPath: string): any {
    var path = environment.apiUrl + ApiConstants.GET_CATEGORY_PAGE_LINKS;
    path = path.replace('{categoryPath}', categoryPath);
    return this.http.get(path);
  }

  saveCategory(form: any): any {
    return this.http.post(environment.apiUrl + ApiConstants.SAVE_CATEGORY,
            form.value, {headers: this.commonService.getEmptyHeaders()});
  }

  updateCategory(form: any): any {
    return this.http.post(environment.apiUrl + ApiConstants.UPDATE_CATEGORY,
            form.value, {headers: this.commonService.getEmptyHeaders()});
  }

  deleteCategory(form: any): any {
    return this.http.post(environment.apiUrl + ApiConstants.DELETE_CATEGORY,
            form.value, {headers: this.commonService.getEmptyHeaders()});
  }

  savePage(form: any): any {
    return this.http.post(environment.apiUrl + ApiConstants.SAVE_PAGE,
            form.value, {headers: this.commonService.getEmptyHeaders()});
  }

  updatePage(form: any): any {
    return this.http.post(environment.apiUrl + ApiConstants.UPDATE_PAGE,
            form.value, {headers: this.commonService.getEmptyHeaders()});
  }

  deletePage(form: any): any {
    return this.http.post(environment.apiUrl + ApiConstants.DELETE_PAGE,
            form.value, {headers: this.commonService.getEmptyHeaders()});
  }

  getCategoryPage(categoryUrlPath: string, pageUrlPath: string): any {
    var path = environment.apiUrl + ApiConstants.GET_CATEGORY_PAGE;
    path = path.replace('{categoryUrlPath}', categoryUrlPath);
    path = path.replace('{pageUrlPath}', pageUrlPath);
    return this.http.get(path);
  }

  updatePageLinks(pageLinks: PageLink[]): any {
    return this.http.post(environment.apiUrl + ApiConstants.UPDATE_PAGE_LINKS,
            pageLinks, {headers: this.commonService.getEmptyHeaders()});
  }

}

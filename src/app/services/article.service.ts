import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConstants } from 'src/app/constants/api-constants';
import { environment } from 'src/environments/environment';
import { Article } from '../models/article';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  
  
  constructor(private http: HttpClient, private commonService: CommonService) { }

  setSelectedArticle(article: Article): void{
    sessionStorage.setItem('selectedArticle', JSON.stringify(article));
  }

  getSelectedArticle(): Article | any {
    const value =  sessionStorage.getItem('selectedArticle');
    if(value !== null && value !== undefined){
      const selectedArticle = JSON.parse(value);
      return selectedArticle;
    }else{
      return null;
    }
  }

  saveArticle(form: any): any {
    return this.http.post(environment.apiUrl + ApiConstants.SAVE_ARTICLE,
            form.value, {headers: this.commonService.getEmptyHeaders()});
  }

  updateArticle(form: any): any {
    return this.http.post(environment.apiUrl + ApiConstants.UPDATE_ARTICLE,
            form.value, {headers: this.commonService.getEmptyHeaders()});
  }

  deleteArticle(form: any): any {
    return this.http.post(environment.apiUrl + ApiConstants.DELETE_ARTICLE,
            form.value, {headers: this.commonService.getEmptyHeaders()});
  }

  getAllArticles(): any {
    return this.http.get(environment.apiUrl + ApiConstants.GET_ALL_ARTICLES);
  }

  getArticle(userId: string, urlPath: string): any {
    var path = environment.apiUrl + ApiConstants.GET_ARTICLE;
    path = path.replace('{authorId}', userId);
    path = path.replace('{urlPath}', urlPath);
    return this.http.get(path);
  }


}

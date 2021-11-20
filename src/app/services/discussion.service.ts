import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiConstants } from '../constants/api-constants';
import { Question } from '../models/question';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class DiscussionService {

  constructor(private http: HttpClient, private commonService: CommonService) { }

  setSelectedQuestion(question: Question): void{
    sessionStorage.setItem('selectedQuestion', JSON.stringify(question));
  }

  getSelectedQuestion(): Question | any {
    const value =  sessionStorage.getItem('selectedQuestion');
    if(value !== null && value !== undefined){
      const selectedQuestion = JSON.parse(value);
      return selectedQuestion;
    }else{
      return null;
    }
  }

  saveQuestion(form: any): any {
    return this.http.post(environment.apiUrl + ApiConstants.SAVE_QUESTION,
            form.value, {headers: this.commonService.getEmptyHeaders()});
  }

  updateQuestion(form: any): any {
    return this.http.post(environment.apiUrl + ApiConstants.UPDATE_QUESTION,
            form.value, {headers: this.commonService.getEmptyHeaders()});
  }

  deleteQuestion(form: any): any {
    return this.http.post(environment.apiUrl + ApiConstants.DELETE_QUESTION,
            form.value, {headers: this.commonService.getEmptyHeaders()});
  }

  getAllQuestions(): any {
    return this.http.get(environment.apiUrl + ApiConstants.GET_ALL_QUESTIONS);
  }

  getQuestion(userId: string, urlPath: string): any {
    var path = environment.apiUrl + ApiConstants.GET_QUESTION;
    path = path.replace('{authorId}', userId);
    path = path.replace('{urlPath}', urlPath);
    return this.http.get(path);
  }

  saveAnswer(form: any): any {
    return this.http.post(environment.apiUrl + ApiConstants.SAVE_ANSWER,
            form.value, {headers: this.commonService.getEmptyHeaders()});
  }

  updateAnswer(form: any): any {
    return this.http.post(environment.apiUrl + ApiConstants.UPDATE_ANSWER,
            form.value, {headers: this.commonService.getEmptyHeaders()});
  }

  deleteAnswer(form: any): any {
    return this.http.post(environment.apiUrl + ApiConstants.DELETE_ANSWER,
            form.value, {headers: this.commonService.getEmptyHeaders()});
  }

  getAllAnswers(userId: string, urlPath: string): any {
    var path = environment.apiUrl + ApiConstants.GET_ALL_ANSWERS;
    path = path.replace('{authorId}', userId);
    path = path.replace('{urlPath}', urlPath);
    return this.http.get(path);
  }

}

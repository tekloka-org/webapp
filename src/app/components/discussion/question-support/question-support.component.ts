import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ResponseConstants } from 'src/app/constants/response-constants';
import { ApiResponse } from 'src/app/models/api-response';
import { Question } from 'src/app/models/question';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DiscussionService } from 'src/app/services/discussion.service';

@Component({
  selector: 'app-question-support',
  templateUrl: './question-support.component.html',
  styleUrls: ['./question-support.component.scss']
})
export class QuestionSupportComponent implements OnInit {

  addForm = new FormGroup({
    summary : new FormControl('', [Validators.required]),
    description : new FormControl('', [Validators.required]),
    urlPath : new FormControl('', [Validators.required]),
    authorId : new FormControl('', [Validators.required])
  });

  updateForm = new FormGroup({
    questionId : new FormControl('', [Validators.required]),
    summary : new FormControl('', [Validators.required]),
    description : new FormControl('', [Validators.required]),
    urlPath : new FormControl('', [Validators.required]),
    authorId : new FormControl('', [Validators.required])
  });

  deleteForm = new FormGroup({
    questionId : new FormControl('', [Validators.required]),
  });

  displayForm: string;

  editorConfig: AngularEditorConfig;
  selectedQuestionAuthorId: string;
  selectedQuestionUrlPath: string;
  selectedQuestion: Question;
  loggedInUser: User;

  constructor(private discussionService: DiscussionService, private activatedRoute: ActivatedRoute,
    private commonService: CommonService, private router: Router, private authService: AuthService) { }
  
  ngOnInit(): void {
    this.editorConfig = this.commonService.editorConfig;

    if(this.authService.isLoggedIn()){
      this.authService.subscribeLoggedInUserSubject().subscribe(result => {
        this.loggedInUser = this.authService.loggedInUserSubject.value as User;
        this.addForm.get('authorId')?.setValue(this.loggedInUser.userId);
      });   
    }

    const supportPageURL = this.router.url;
    if (supportPageURL.includes('add')) {
      this.displayForm = 'ADD_FORM' 
    }else if(supportPageURL.includes('update')){
      this.displayForm = 'UPDATE_FORM';
    }else if(supportPageURL.includes('delete')){
      this.displayForm = 'DELETE_FORM';
    }

    //validating artilce path in url
    if(supportPageURL.includes('update') || supportPageURL.includes('delete')) {
      this.activatedRoute.params.subscribe(params => {
        this.selectedQuestionAuthorId = params['author-id'] 
        this.selectedQuestionUrlPath = params['question-url-path'];
        var questionParam = this.discussionService.getSelectedQuestion() as Question;
        if(questionParam === null || questionParam === undefined || questionParam.urlPath !== this.selectedQuestionUrlPath){
          this.discussionService.getQuestion(this.selectedQuestionAuthorId, this.selectedQuestionUrlPath).subscribe((response: ApiResponse) => {
            if (response.code === ResponseConstants.QUESTION_FOUND) {
              const data = response.data as any;
              this.selectedQuestion = data.question;
              this.setFormValues(this.selectedQuestion);              
            }
          });
        }else{
          this.selectedQuestion = questionParam;
          this.setFormValues(this.selectedQuestion);
        }
      });
    }

  }

  setFormValues(selectedQuestion: Question) {    
    this.updateForm.get('questionId')?.setValue(selectedQuestion.questionId);
    this.updateForm.get('summary')?.setValue(selectedQuestion.summary);
    this.updateForm.get('description')?.setValue(selectedQuestion.description);
    this.updateForm.get('authorId')?.setValue(selectedQuestion.authorId);
    this.updateForm.get('urlPath')?.setValue(selectedQuestion.urlPath);
    this.deleteForm.get('questionId')?.setValue(selectedQuestion.questionId);
  }

  save() {
    if (this.addForm.valid) {
      this.discussionService.saveQuestion(this.addForm).subscribe((response: ApiResponse) => {
        if (response.code === ResponseConstants.QUESTION_SAVED) {
          const data = response.data as any;
          const savedQuestion = data.question as Question;
          this.discussionService.setSelectedQuestion(savedQuestion);
          this.commonService.displaySnackBarMessages('added', 3000);
          this.router.navigate(['question', savedQuestion.authorId, savedQuestion.urlPath]);
        }
      });
    }
  }

  update() {
    if (this.updateForm.valid) {
      this.discussionService.updateQuestion(this.updateForm).subscribe((response: ApiResponse) => {
        if (response.code === ResponseConstants.QUESTION_UPDATED) {
          const data = response.data as any;
          const savedQuestion = data.question as Question;
          this.commonService.displaySnackBarMessages('updated', 3000);
          this.router.navigate(['question', savedQuestion.authorId, savedQuestion.urlPath]);
        }
      });
    }
  }

  delete() {
    if (this.deleteForm.valid) {
      this.discussionService.deleteQuestion(this.deleteForm).subscribe((response: ApiResponse) => {
        if (response.code === ResponseConstants.QUESTION_DELETED) {
          this.commonService.displaySnackBarMessages('deleted', 3000);
          this.router.navigate(['questions']);
        }
      });
    }
  }

  setAddFormURLPath(){
    let summary = this.addForm.get('summary')?.value;
    let url = this.formatURL(summary);
    this.addForm.get('urlPath')?.setValue(url);
  }

  setUpdateFormURLPath(){
    let summary = this.updateForm.get('summary')?.value;
    let url = this.formatURL(summary);
    this.updateForm.get('urlPath')?.setValue(url);
  }

  formatURL(summary: string): string{
    return this.commonService.formatURL(summary);
  }
}

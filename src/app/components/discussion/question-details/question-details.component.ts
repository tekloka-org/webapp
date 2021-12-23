import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { TranslateService } from '@ngx-translate/core';
import { ModalConstants } from 'src/app/constants/modal-constants';
import { PermissionConstants } from 'src/app/constants/permission-constants';
import { ResponseConstants } from 'src/app/constants/response-constants';
import { Answer } from 'src/app/models/answer';
import { ApiResponse } from 'src/app/models/api-response';
import { Question } from 'src/app/models/question';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DiscussionService } from 'src/app/services/discussion.service';
import { ModalComponent } from '../../common/modal/modal.component';
import { AnswerSupportComponent } from '../answer-support/answer-support.component';

@Component({
  selector: 'app-question-details',
  templateUrl: './question-details.component.html',
  styleUrls: ['./question-details.component.scss']
})
export class QuestionDetailsComponent implements OnInit {

  selectedQuestionAuthorId: string;
  selectedQuestionUrlPath: string;
  selectedQuestion: Question;
  allAnswers: Answer[];
  loggedInUser: User;
  isLoggedIn: boolean = false;
  PermissionConstants = PermissionConstants;

  addAnswerForm = new FormGroup({
    description : new FormControl('', [Validators.required]),
    authorId : new FormControl('', [Validators.required]),
    questionId : new FormControl('', [Validators.required])
  });

  editorConfig: AngularEditorConfig;

  constructor(private activatedRoute: ActivatedRoute, private discussionService: DiscussionService,
    private translateService: TranslateService, public dialog: MatDialog,
    private authService: AuthService, private commonService: CommonService) { }

  ngOnInit(): void {

    this.editorConfig = this.commonService.editorConfig;

    this.authService.subscribeLoggedInUserSubject().subscribe(result => {
      this.loggedInUser = this.authService.loggedInUserSubject.value as User;
      this.isLoggedIn = this.authService.isLoggedIn();
      this.addAnswerForm.get('authorId')?.setValue(this.loggedInUser?.userId);
    });

    this.activatedRoute.params.subscribe(params => {
      this.selectedQuestionAuthorId = params['author-id']
      this.selectedQuestionUrlPath = params['question-url-path'];
      var questionParam = this.discussionService.getSelectedQuestion() as Question;
      if (questionParam === null || questionParam === undefined || questionParam.urlPath !== this.selectedQuestionUrlPath) {
        this.discussionService.getQuestion(this.selectedQuestionAuthorId, this.selectedQuestionUrlPath).subscribe((response: ApiResponse) => {
          if (response.code === ResponseConstants.QUESTION_FOUND) {
            const data = response.data as any;
            this.selectedQuestion = data.question;
            this.addAnswerForm.get('questionId')?.setValue(this.selectedQuestion?.questionId);
          }
        });
      } else {
        this.selectedQuestion = questionParam;
        this.addAnswerForm.get('questionId')?.setValue(this.selectedQuestion?.questionId);
      }
    });

    this.discussionService.getAllAnswers(this.selectedQuestionAuthorId, this.selectedQuestionUrlPath).subscribe((response: ApiResponse) => {
      if (response.code === ResponseConstants.ANSWER_LIST_FOUND) {
        const data = response.data as any;
        this.allAnswers = data.answerList as Answer[];
      }
    });
  }

  displayAddAnswerPage() {
    if(this.isLoggedIn){
      const dialogRef = this.dialog.open(AnswerSupportComponent, {
        width: '50%',
        id: 'add-answer-modal',
        data: { tab: ModalConstants.ADD_ANSWER_MODAL, question: this.selectedQuestion, loggedInUserId: this.loggedInUser.userId }
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result?.code === ResponseConstants.ANSWER_SAVED) {
          this.allAnswers.unshift(result.answer);
        }
      });
    }else{
      let messages = {
        title: 'messages.mustLogin',
        content: ''
      };
      const modalDialogRef = this.dialog.open(ModalComponent, {
        width: '500px',
        id: 'modalDialog',
        data: { tab: ModalConstants.INFO_MODAL, messages: messages }
     });
    }
  }

  displayUpdateAnswerPage(index: number, answer: Answer) {
    const dialogRef = this.dialog.open(AnswerSupportComponent, {
      width: '50%',
      id: 'update-answer-modal',
      data: { tab: ModalConstants.UPDATE_ANSWER_MODAL, question: this.selectedQuestion, 
        loggedInUserId: this.loggedInUser.userId, answer: answer }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result?.code === ResponseConstants.ANSWER_UPDATED) {
        this.allAnswers[index] = result.answer;
      }
    });
  }

  displayDeleteAnswerPage(index: number, answer: Answer) {
    const dialogRef = this.dialog.open(AnswerSupportComponent, {
      width: '500px',
      id: 'delete-answer-modal',
      data: { tab: ModalConstants.DELETE_ANSWER_MODAL, question: this.selectedQuestion, 
        loggedInUserId: this.loggedInUser.userId, answer: answer }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result?.code === ResponseConstants.ANSWER_DELETED) {
        this.allAnswers.splice(index, 1);
      }
    });
  }

  hasPermission(permissionKey: string): boolean{
    return this.authService.hasPermission(permissionKey);
  }

  hasAnswerEditAccess(answer: Answer): boolean{
    let hasAccess = false;
    let loggedInUser = this.authService.loggedInUserSubject.value;
    if(loggedInUser.userId === answer.authorId){
      hasAccess = true;
    }
    return hasAccess;
  }

  saveAnswer(){
    if(this.isLoggedIn){      
      if(this.addAnswerForm.valid){
        this.discussionService.saveAnswer(this.addAnswerForm).subscribe((response: ApiResponse) => {
          if(response.code === ResponseConstants.ANSWER_SAVED){
            const data = response.data as any;
            this.commonService.displaySnackBarMessages('added', 3000);
            this.allAnswers.push(data.answer as Answer);
            this.addAnswerForm.get('description')?.setValue('');
          }
        });
      }
    }else{
      let messages = {
        title: 'messages.mustLogin',
        content: ''
      };
      const modalDialogRef = this.dialog.open(ModalComponent, {
        width: '500px',
        id: 'modalDialog',
        data: { tab: ModalConstants.INFO_MODAL, messages: messages }
     });
    }
  }

}

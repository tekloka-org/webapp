import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ModalConstants } from 'src/app/constants/modal-constants';
import { PermissionConstants } from 'src/app/constants/permission-constants';
import { ResponseConstants } from 'src/app/constants/response-constants';
import { Answer } from 'src/app/models/answer';
import { ApiResponse } from 'src/app/models/api-response';
import { Question } from 'src/app/models/question';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { DiscussionService } from 'src/app/services/discussion.service';
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
  PermissionConstants = PermissionConstants;

  constructor(private activatedRoute: ActivatedRoute, private discussionService: DiscussionService,
    private translateService: TranslateService, public dialog: MatDialog,
    private authService: AuthService) { }

  ngOnInit(): void {

    if (this.authService.isLoggedIn()) {
      this.authService.subscribeLoggedInUserSubject().subscribe(result => {
        this.loggedInUser = this.authService.loggedInUserSubject.value as User;
      });
    }

    this.activatedRoute.params.subscribe(params => {
      this.selectedQuestionAuthorId = params['author-id']
      this.selectedQuestionUrlPath = params['question-url-path'];
      var questionParam = this.discussionService.getSelectedQuestion() as Question;
      if (questionParam === null || questionParam === undefined || questionParam.urlPath !== this.selectedQuestionUrlPath) {
        this.discussionService.getQuestion(this.selectedQuestionAuthorId, this.selectedQuestionUrlPath).subscribe((response: ApiResponse) => {
          if (response.code === ResponseConstants.QUESTION_FOUND) {
            const data = response.data as any;
            this.selectedQuestion = data.question;
          }
        });
      } else {
        this.selectedQuestion = questionParam;
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
    let messages = {
      title: 'Add Answer'
    };
    this.translateService.get('discussion.addAnswer').subscribe((res: string) => {
      messages.title = res;
    });
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
  }

  displayUpdateAnswerPage(index: number, answer: Answer) {
    let messages = {
      title: 'Update Answer',
      answer: answer
    };
    this.translateService.get('discussion.updateAnswer').subscribe((res: string) => {
      messages.title = res;
    });
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
    let messages = {
      title: 'Delete Answer',
      answer: answer
    };
    this.translateService.get('discussion.deleteAnswer').subscribe((res: string) => {
      messages.title = res;
    });
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

}

import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ModalConstants } from 'src/app/constants/modal-constants';
import { ResponseConstants } from 'src/app/constants/response-constants';
import { Answer } from 'src/app/models/answer';
import { ApiResponse } from 'src/app/models/api-response';
import { Question } from 'src/app/models/question';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DiscussionService } from 'src/app/services/discussion.service';

@Component({
  selector: 'app-answer-support',
  templateUrl: './answer-support.component.html',
  styleUrls: ['./answer-support.component.scss']
})
export class AnswerSupportComponent implements OnInit {

  ADD_ANSWER_MODAL = ModalConstants.ADD_ANSWER_MODAL;
  UPDATE_ANSWER_MODAL = ModalConstants.UPDATE_ANSWER_MODAL;
  DELETE_ANSWER_MODAL = ModalConstants.DELETE_ANSWER_MODAL;

  addForm = new FormGroup({
    description : new FormControl('', [Validators.required]),
    authorId : new FormControl('', [Validators.required]),
    questionId : new FormControl('', [Validators.required])
  });

  updateForm = new FormGroup({
    answerId : new FormControl('', [Validators.required]),
    description : new FormControl('', [Validators.required]),
    authorId : new FormControl('', [Validators.required]),
    questionId : new FormControl('', [Validators.required])
  });

  deleteForm = new FormGroup({
    answerId : new FormControl('', [Validators.required]),
  });

  editorConfig: AngularEditorConfig;
  selectedQuestion: Question;
  selectedAnswer: Answer;
  loggedInUserId: string;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
              private discussionService: DiscussionService, private commonService: CommonService,
              private dialogRef: MatDialogRef<AnswerSupportComponent>) { }

  ngOnInit(): void {
    
    this.editorConfig = this.commonService.editorConfig;
    
    this.selectedAnswer = this.dialogData.answer;
    this.selectedQuestion = this.dialogData.question;
    this.loggedInUserId = this.dialogData.loggedInUserId;

    if(this.dialogData.tab === this.ADD_ANSWER_MODAL){
      this.addForm.get('questionId')?.setValue(this.selectedQuestion?.questionId);
      this.addForm.get('authorId')?.setValue(this.loggedInUserId);
    }else if(this.dialogData.tab === this.UPDATE_ANSWER_MODAL){
      this.updateForm.get('answerId')?.setValue(this.selectedAnswer?.answerId);
      this.updateForm.get('description')?.setValue(this.selectedAnswer?.description);
      this.updateForm.get('authorId')?.setValue(this.selectedAnswer?.authorId);
      this.updateForm.get('questionId')?.setValue(this.selectedAnswer?.questionId);
    }else if(this.dialogData.tab === this.DELETE_ANSWER_MODAL){
      this.deleteForm.get('answerId')?.setValue(this.selectedAnswer?.answerId);
    }

  }

  save(){
    if(this.addForm.valid){
      this.discussionService.saveAnswer(this.addForm).subscribe((response: ApiResponse) => {
        if(response.code === ResponseConstants.ANSWER_SAVED){
          const data = response.data as any;
          this.commonService.displaySnackBarMessages('added', 3000);
          this.dialogRef.close({ code: ResponseConstants.ANSWER_SAVED, answer: data.answer });
        }
      });
    }
  }

  update(){
    if(this.updateForm.valid){
      this.discussionService.updateAnswer(this.updateForm).subscribe((response: ApiResponse) => {
        if(response.code === ResponseConstants.ANSWER_UPDATED){
          const data = response.data as any;
          this.commonService.displaySnackBarMessages('updated', 3000);
          this.dialogRef.close({ code: ResponseConstants.ANSWER_UPDATED, answer: data.answer });
        }
      });
    }
  }

  delete(){
    if(this.deleteForm.valid){
      this.discussionService.deleteAnswer(this.deleteForm).subscribe((response: ApiResponse) => {
        if(response.code === ResponseConstants.ANSWER_DELETED){
          this.commonService.displaySnackBarMessages('deleted', 3000);
          this.dialogRef.close({ code: ResponseConstants.ANSWER_DELETED});
        }
      });
    }
  }



//   displayForm: string;

//   editorConfig: AngularEditorConfig;
//   selectedAnswerAuthorId: string;
//   selectedAnswerUrlPath: string;
//   selectedAnswer: Answer;
//   loggedInUser: User;

//   constructor(private discussionService: DiscussionService, private activatedRoute: ActivatedRoute,
//     private commonService: CommonService, private router: Router, private authService: AuthService) { }
  
//   ngOnInit(): void {
//     this.editorConfig = this.commonService.editorConfig;

//     const supportPageURL = this.router.url;
//     if (supportPageURL.includes('add')) {
//       this.displayForm = 'ADD_FORM'
      
//       if(this.authService.isLoggedIn()){
//         this.authService.subscribeLoggedInUserSubject().subscribe(result => {
//           this.loggedInUser = this.authService.loggedInUserSubject.value as User;
//           this.addForm.get('authorId')?.setValue(this.loggedInUser.userId);
//         });
        
        
//       }
//     }else if(supportPageURL.includes('update')){
//       this.displayForm = 'UPDATE_FORM';
//     }else if(supportPageURL.includes('delete')){
//       this.displayForm = 'DELETE_FORM';
//     }

//     //validating artilce path in url
//     if(supportPageURL.includes('update') || supportPageURL.includes('delete')) {
//       this.activatedRoute.params.subscribe(params => {
//         this.selectedAnswerAuthorId = params['author-id'] 
//         this.selectedAnswerUrlPath = params['question-url-path'];
//         var questionParam = this.discussionService.getSelectedQuestion() as Question;
//         if(questionParam === null || questionParam === undefined || questionParam.urlPath !== this.selectedQuestionUrlPath){
//           this.discussionService.getQuestion(this.selectedQuestionAuthorId, this.selectedQuestionUrlPath).subscribe((response: ApiResponse) => {
//             if (response.code === ResponseConstants.QUESTION_FOUND) {
//               const data = response.data as any;
//               this.selectedQuestion = data.question;
//               this.setFormValues(this.selectedQuestion);              
//             }
//           });
//         }else{
//           this.selectedQuestion = questionParam;
//           this.setFormValues(this.selectedQuestion);
//         }
//       });
//     }

//   }

//   setFormValues(selectedQuestion: Question) {    
//     this.updateForm.get('questionId')?.setValue(selectedQuestion.questionId);
//     this.updateForm.get('summary')?.setValue(selectedQuestion.summary);
//     this.updateForm.get('description')?.setValue(selectedQuestion.description);
//     this.updateForm.get('authorId')?.setValue(selectedQuestion.authorId);
//     this.updateForm.get('urlPath')?.setValue(selectedQuestion.urlPath);
//     this.deleteForm.get('questionId')?.setValue(selectedQuestion.questionId);
//   }

//   save() {
//     if (this.addForm.valid) {
//       this.discussionService.saveQuestion(this.addForm).subscribe((response: ApiResponse) => {
//         if (response.code === ResponseConstants.QUESTION_SAVED) {
//           const data = response.data as any;
//           const savedQuestion = data.question as Question;
//           this.discussionService.setSelectedQuestion(savedQuestion);
//           this.commonService.displaySnackBarMessages('added', 3000);
//           this.router.navigate(['question-details', savedQuestion.authorId, savedQuestion.urlPath]);
//         }
//       });
//     }
//   }

//   update() {
//     if (this.updateForm.valid) {
//       this.discussionService.updateQuestion(this.updateForm).subscribe((response: ApiResponse) => {
//         if (response.code === ResponseConstants.QUESTION_UPDATED) {
//           const data = response.data as any;
//           const savedQuestion = data.question as Question;
//           this.commonService.displaySnackBarMessages('updated', 3000);
//           this.router.navigate(['question-details', savedQuestion.authorId, savedQuestion.urlPath]);
//         }
//       });
//     }
//   }

//   delete() {
//     if (this.deleteForm.valid) {
//       this.discussionService.deleteQuestion(this.deleteForm).subscribe((response: ApiResponse) => {
//         if (response.code === ResponseConstants.QUESTION_DELETED) {
//           this.commonService.displaySnackBarMessages('deleted', 3000);
//           this.router.navigate(['questions']);
//         }
//       });
//     }
//   }
// }

}

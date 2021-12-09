import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PermissionConstants } from 'src/app/constants/permission-constants';
import { ResponseConstants } from 'src/app/constants/response-constants';
import { ApiResponse } from 'src/app/models/api-response';
import { Question } from 'src/app/models/question';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { DiscussionService } from 'src/app/services/discussion.service';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss']
})
export class QuestionListComponent implements OnInit {

  dataSource:  MatTableDataSource<any>;
  displayedColumns: string[] ;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  PermissionConstants = PermissionConstants;

  constructor(private router: Router, private discussionService: DiscussionService,
    private commonService: CommonService, private authService: AuthService) { }

  ngOnInit(): void {
   this.displayedColumns = [ 'name','createdOn', 'modifiedOn', 'authorName', 'actions'];
   this.discussionService.getAllQuestions().subscribe((response: ApiResponse) => {
      if(response.code === ResponseConstants.QUESTION_LIST_FOUND){
        const data = response.data as any;
        this.dataSource = new MatTableDataSource(data.questionList);
        this.dataSource.sortingDataAccessor = (obj, property) => this.getProperty(obj, property);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = (data: any, filter) => {
          const dataStr =JSON.stringify(data).toLowerCase();
          return dataStr.indexOf(filter) != -1;
        }
      }
    });

  }

  getProperty = (obj: any, path: string) => (
    path.split('.').reduce((o, p) => o && o[p], obj)
  )

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  displayAddPage(){
    this.router.navigate(['add-question']);
  }

  displayUpdatePage(question: Question){
    this.discussionService.setSelectedQuestion(question);
    this.router.navigate(['update-question', question.authorId, question.urlPath]);
  }

  displayDeletePage(question: Question){
    this.discussionService.setSelectedQuestion(question);
    this.router.navigate(['delete-question', question.authorId, question.urlPath]);
  }

  displayDetailsPage(question: Question){
    this.discussionService.setSelectedQuestion(question);
    this.router.navigate(['question', question.authorId, question.urlPath]);
  }

  hasPermission(permissionKey: string): boolean{
    return this.authService.hasPermission(permissionKey);
  }

}

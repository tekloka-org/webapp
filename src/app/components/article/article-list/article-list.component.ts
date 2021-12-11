import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PermissionConstants } from 'src/app/constants/permission-constants';
import { ResponseConstants } from 'src/app/constants/response-constants';
import { RouterConstants } from 'src/app/constants/router-constants';
import { ApiResponse } from 'src/app/models/api-response';
import { Article } from 'src/app/models/article';
import { ArticleService } from 'src/app/services/article.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent implements OnInit {

  dataSource:  MatTableDataSource<any>;
  displayedColumns: string[] ;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  PermissionConstants = PermissionConstants;

  constructor(private router: Router, private articleService: ArticleService,
    private commonService: CommonService, private authService: AuthService) { }

  ngOnInit(): void {
   this.displayedColumns = [ 'name','createdOn', 'modifiedOn', 'authorName', 'actions'];

   this.articleService.getAllArticles().subscribe((response: ApiResponse) => {
      if(response.code === ResponseConstants.ARTICLE_LIST_FOUND){
        const data = response.data as any;
        this.dataSource = new MatTableDataSource(data.articleList);
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
    this.router.navigate(['add-article']);
  }

  displayUpdatePage(article: Article){
    this.articleService.setSelectedArticle(article);
    this.router.navigate(['update-article', article.authorId, article.urlPath]);
  }

  displayDeletePage(article: Article){
    this.articleService.setSelectedArticle(article);
    this.router.navigate(['delete-article', article.authorId,article.urlPath]);
  }

  displayDetailsPage(article: Article){
    this.articleService.setSelectedArticle(article);
    this.router.navigate([RouterConstants.VIEW_ARTICLE, article.authorId,article.urlPath]);
  }

  hasPermission(permissionKey: string): boolean{
    return this.authService.hasPermission(permissionKey);
  }

}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ResponseConstants } from 'src/app/constants/response-constants';
import { ApiResponse } from 'src/app/models/api-response';
import { Article } from 'src/app/models/article';
import { User } from 'src/app/models/user';
import { ArticleService } from 'src/app/services/article.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-article-support',
  templateUrl: './article-support.component.html',
  styleUrls: ['./article-support.component.scss']
})
export class ArticleSupportComponent implements OnInit {

  addForm = new FormGroup({
    name : new FormControl('', [Validators.required]),
    urlPath : new FormControl('', [Validators.required]),
    content : new FormControl('', [Validators.required]),
    authorId : new FormControl('', [Validators.required])
  });

  updateForm = new FormGroup({
    articleId : new FormControl('', [Validators.required]),
    name : new FormControl('', [Validators.required]),
    urlPath : new FormControl('', [Validators.required]),
    content : new FormControl('', [Validators.required]),
    authorId : new FormControl('', [Validators.required])
  });

  deleteForm = new FormGroup({
    articleId : new FormControl('', [Validators.required]),
  });

  displayForm: string;

  editorConfig: AngularEditorConfig;
  selectedArticleUrlPath: string;
  selectedArticleAuthorId: string;
  selectedArticle: Article;
  loggedInUser: User;

  constructor(private articleService: ArticleService, private activatedRoute: ActivatedRoute,
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
        this.selectedArticleAuthorId = params['author-id'] 
        this.selectedArticleUrlPath = params['article-url-path'];
        var articleParam = this.articleService.getSelectedArticle() as Article;
        if(articleParam === null || articleParam === undefined || articleParam.urlPath !== this.selectedArticleUrlPath){
          this.articleService.getArticle(this.selectedArticleAuthorId, this.selectedArticleUrlPath).subscribe((response: ApiResponse) => {
            if (response.code === ResponseConstants.ARTICLE_FOUND) {
              const data = response.data as any;
              this.selectedArticle = data.article;
              this.setFormValues(this.selectedArticle);              
            }
          });
        }else{
          this.selectedArticle = articleParam;
          this.setFormValues(this.selectedArticle);
        }
      });
    }

    

  }

  setFormValues(selectedArticle: Article) {    
    this.updateForm.get('articleId')?.setValue(selectedArticle.articleId);
    this.updateForm.get('name')?.setValue(selectedArticle.name);
    this.updateForm.get('authorId')?.setValue(selectedArticle.authorId);
    this.updateForm.get('urlPath')?.setValue(selectedArticle.urlPath);
    this.updateForm.get('content')?.setValue(selectedArticle.content);
    this.deleteForm.get('articleId')?.setValue(selectedArticle.articleId);
  }

  save() {
    if (this.addForm.valid) {
      this.articleService.saveArticle(this.addForm).subscribe((response: ApiResponse) => {
        if (response.code === ResponseConstants.ARTICLE_SAVED) {
          const data = response.data as any;
          const savedArticle = data.article as Article;
          this.articleService.setSelectedArticle(savedArticle);
          this.commonService.displaySnackBarMessages('added', 3000);
          this.router.navigate(['article-details', savedArticle.authorId, savedArticle.urlPath]);
        }
      });
    }
  }

  update() {
    if (this.updateForm.valid) {
      this.articleService.updateArticle(this.updateForm).subscribe((response: ApiResponse) => {
        if (response.code === ResponseConstants.ARTICLE_UPDATED) {
          const data = response.data as any;
          const savedArticle = data.article as Article;
          this.commonService.displaySnackBarMessages('updated', 3000);
          this.router.navigate(['article-details', savedArticle.authorId, savedArticle.urlPath]);
        }
      });
    }
  }

  delete() {
    if (this.deleteForm.valid) {
      this.articleService.deleteArticle(this.deleteForm).subscribe((response: ApiResponse) => {
        if (response.code === ResponseConstants.ARTICLE_DELETED) {
          this.commonService.displaySnackBarMessages('deleted', 3000);
          this.router.navigate(['articles']);
        }
      });
    }
  }


  setAddFormURLPath(){
    let name = this.addForm.get('name')?.value;
    let url = this.formatURL(name);
    this.addForm.get('urlPath')?.setValue(url);
  }

  setUpdateFormURLPath(){
    let name = this.updateForm.get('name')?.value;
    let url = this.formatURL(name);
    this.updateForm.get('urlPath')?.setValue(url);
  }

  formatURL(name: string): string{
    return this.commonService.formatURL(name);
  }

}

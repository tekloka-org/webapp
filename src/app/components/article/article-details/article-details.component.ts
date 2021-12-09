import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResponseConstants } from 'src/app/constants/response-constants';
import { ApiResponse } from 'src/app/models/api-response';
import { Article } from 'src/app/models/article';
import { ArticleService } from 'src/app/services/article.service';

@Component({
  selector: 'app-article-details',
  templateUrl: './article-details.component.html',
  styleUrls: ['./article-details.component.scss']
})
export class ArticleDetailsComponent implements OnInit {

  selectedArticleAuthorId: string;
  selectedArticleUrlPath: string;
  selectedArticle: Article;

  constructor(private activatedRoute: ActivatedRoute, private articleService: ArticleService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.selectedArticleAuthorId = params['author-id'];
      this.selectedArticleUrlPath = params['article-url-path'];
      var articleParam = this.articleService.getSelectedArticle() as Article;
      if(articleParam === null || articleParam === undefined || articleParam.urlPath !== this.selectedArticleUrlPath){
        this.articleService.getArticle(this.selectedArticleAuthorId, this.selectedArticleUrlPath).subscribe((response: ApiResponse) => {
          if (response.code === ResponseConstants.ARTICLE_FOUND) {
            const data = response.data as any;
            this.selectedArticle = data.article;              
          }
        });
      }else{
        this.selectedArticle = articleParam;
      }
    });
  }
}

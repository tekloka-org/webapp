import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval } from 'rxjs';
import { ResponseConstants } from 'src/app/constants/response-constants';
import { ApiResponse } from 'src/app/models/api-response';
import { Article } from 'src/app/models/article';
import { Category } from 'src/app/models/category';
import { Question } from 'src/app/models/question';
import { ArticleService } from 'src/app/services/article.service';
import { CategoryService } from 'src/app/services/category.service';
import { DiscussionService } from 'src/app/services/discussion.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    // the fade-in/fade-out animation.
    trigger('fadeAnimation', [

      // the "in" style determines the "resting" state of the element when it is visible.
      state('in', style({opacity: 1})),

      // fade in when created. this could also be written as transition('void => *')
      transition(':enter', [
        style({opacity: 0}),
        animate(200)
      ]),

      // fade out when destroyed. this could also be written as transition('void => *')
      transition(':leave',
        animate(400, style({opacity: 0})))
    ])
  ]
})
export class HomeComponent implements OnInit {

  categories: Category[];
  articles: Article[];
  filteredArticles: Article[] = [];
  questions: Question[];

  items: string[] = ['1','2','3'];
  index: number = 0;

  constructor(private categoryService: CategoryService, private articleService: ArticleService,
    private discussionService: DiscussionService, private router: Router) { }

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe((response: ApiResponse) => {
      if(response.code === ResponseConstants.CATEGORY_LIST_FOUND){
        const data = response.data as any;
        this.categories = data.categoryList as Category[];
      }
    });

    this.articleService.getAllArticles().subscribe((response: ApiResponse) =>{
      if(response.code === ResponseConstants.ARTICLE_LIST_FOUND){
        const data = response.data as any;
        this.articles = data.articleList as Article[];
      }
    });

    this.discussionService.getAllQuestions().subscribe((response: ApiResponse) =>{
      if(response.code === ResponseConstants.QUESTION_LIST_FOUND){
        const data = response.data as any;
        this.questions = data.questionList as Question[];
      }
    });

    // interval(3000).subscribe(x => {
    //   this.filteredArticles = this.filteredArticles.slice(1);
    //   this.filteredArticles.push(this.articles[this.index])
    //   this.index++;
    // });
  }


  showArticleDetails(article: Article){
    this.articleService.setSelectedArticle(article);
    this.router.navigate(['article', article.authorId,article.urlPath]);
  }

  showQuestionDetails(question: Question){
    this.discussionService.setSelectedQuestion(question);
    this.router.navigate(['question', question.authorId, question.urlPath]);
  }

}

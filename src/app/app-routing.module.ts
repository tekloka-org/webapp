import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleListComponent } from './components/article/article-list/article-list.component';
import { CategoryDetailsComponent } from './components/category/category-details/category-details.component';
import { CategoryListComponent } from './components/category/category-list/category-list.component';
import { PageDetailsComponent } from './components/category/page-details/page-details.component';
import { PageSupportComponent } from './components/category/page-support/page-support.component';
import { HomeComponent } from './components/home/home.component';
import { PermissionListComponent } from './components/user-management/permission-list/permission-list.component';
import { RoleListComponent } from './components/user-management/role-list/role-list.component';
import { RoleSupportComponent } from './components/user-management/role-support/role-support.component';
import { UserListComponent } from './components/user-management/user-list/user-list.component';
import { UserSupportComponent } from './components/user-management/user-support/user-support.component';
import { ArticleSupportComponent } from './components/article/article-support/article-support.component';
import { ArticleDetailsComponent } from './components/article/article-details/article-details.component';
import { QuestionSupportComponent } from './components/discussion/question-support/question-support.component';
import { QuestionListComponent } from './components/discussion/question-list/question-list.component';
import { QuestionDetailsComponent } from './components/discussion/question-details/question-details.component';

const routes: Routes = [
  { path: 'home', component:  HomeComponent},
  
  { path: 'category-master', component:  CategoryListComponent},
  { path: 'user-management/permission-list', component:  PermissionListComponent},
  
  { path: 'user-management/role-list', component:  RoleListComponent},
  { path: 'user-management/add-role', component:  RoleSupportComponent},
  { path: 'user-management/update-role/:role-code', component:  RoleSupportComponent},
  { path: 'user-management/delete-role/:role-code', component:  RoleSupportComponent},
  
  { path: 'user-management/user-list', component:  UserListComponent},
  { path: 'user-management/add-user', component:  UserSupportComponent},
  { path: 'user-management/update-user/:email-address', component:  UserSupportComponent},
  { path: 'user-management/delete-user/:email-address', component:  UserSupportComponent},

  { path: 'articles', component: ArticleListComponent},
  { path: 'add-article', component: ArticleSupportComponent},
  { path: 'update-article/:author-id/:article-url-path', component: ArticleSupportComponent},
  { path: 'delete-article/:author-id/:article-url-path', component: ArticleSupportComponent},
  { path: 'article/:author-id/:article-url-path', component: ArticleDetailsComponent},

  { path: 'questions', component: QuestionListComponent},
  { path: 'add-question', component: ArticleSupportComponent},
  { path: 'update-question/:author-id/:question-url-path', component: ArticleSupportComponent},
  { path: 'delete-question/:author-id/:question-url-path', component: ArticleSupportComponent},
  { path: 'question/:author-id/:question-url-path', component: QuestionDetailsComponent},

  { path: 'category/:category-url-path', component:  CategoryDetailsComponent,
    children: [
      { path: 'add-page', component:  PageSupportComponent},
      { path: 'update-page/:page-url-path', component:  PageSupportComponent},
      { path: 'delete-page/:page-url-path', component:  PageSupportComponent},
      { path: ':page-url-path', component:  PageDetailsComponent}
    ]
  },
  
  { path: '',   redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

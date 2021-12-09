import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './modules/material/material.module';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AuthDialogComponent } from './components/header/auth-dialog/auth-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContentComponent } from './components/content/content.component';
import { PageDetailsComponent } from './components/category/page-details/page-details.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { HomeComponent } from './components/home/home.component';
import { CategoryDetailsComponent } from './components/category/category-details/category-details.component';
import { CategorySupportComponent } from './components/category/category-support/category-support.component';
import { PageSupportComponent } from './components/category/page-support/page-support.component';
import { CategoryListComponent } from './components/category/category-list/category-list.component';
import { PermissionListComponent } from './components/user-management/permission-list/permission-list.component';
import { PermissionSupportComponent } from './components/user-management/permission-support/permission-support.component';
import { RoleListComponent } from './components/user-management/role-list/role-list.component';
import { RoleSupportComponent } from './components/user-management/role-support/role-support.component';
import { UserListComponent } from './components/user-management/user-list/user-list.component';
import { UserSupportComponent } from './components/user-management/user-support/user-support.component';
import { ModalComponent } from './components/common/modal/modal.component';
import { CustomHttpInterceptor } from './interceptors/custom-http.interceptor';
import { ArticleListComponent } from './components/article/article-list/article-list.component';
import { ArticleDetailsComponent } from './components/article/article-details/article-details.component';
import { ArticleSupportComponent } from './components/article/article-support/article-support.component';
import { QuestionDetailsComponent } from './components/discussion/question-details/question-details.component';
import { QuestionSupportComponent } from './components/discussion/question-support/question-support.component';
import { QuestionListComponent } from './components/discussion/question-list/question-list.component';
import { AnswerSupportComponent } from './components/discussion/answer-support/answer-support.component';
import { ProcessComponent } from './components/common/process/process.component';
import { LoginComponent } from './components/header/login/login.component';
import { SignUpComponent } from './components/header/sign-up/sign-up.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    AuthDialogComponent,
    ContentComponent,
    PageDetailsComponent,
    HomeComponent,
    CategoryDetailsComponent,
    CategorySupportComponent,
    PageSupportComponent,
    CategoryListComponent,
    PermissionListComponent,
    PermissionSupportComponent,
    RoleListComponent,
    RoleSupportComponent,
    UserListComponent,
    UserSupportComponent,
    ModalComponent,
    ArticleListComponent,
    ArticleDetailsComponent,
    ArticleSupportComponent,
    QuestionSupportComponent,
    QuestionDetailsComponent,
    QuestionListComponent,
    AnswerSupportComponent,
    ProcessComponent,
    LoginComponent,
    SignUpComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: 'en'
    }),
    AngularEditorModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: CustomHttpInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}
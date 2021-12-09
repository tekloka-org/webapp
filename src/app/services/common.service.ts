import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { ModalComponent } from '../components/common/modal/modal.component';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ApiConstants } from '../constants/api-constants';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  editorConfig: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: 'auto',
      minHeight: '400px',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    //uploadUrl: environment.apiUrl+ApiConstants.UPLOAD_FILE,
    // upload: (file: File) => { 
    //   return this.upload('/content-docs/', file);
    // },
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['insertVideo']
    ]
};

  constructor(private snackBar: MatSnackBar, public dialog: MatDialog, private http: HttpClient,
    private translateService: TranslateService) { }

  getJSONHeaders(): HttpHeaders {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return headers;
  }

  getEmptyHeaders(): HttpHeaders {
    const headers = new HttpHeaders();
    return headers;
  }

  displaySnackBarMessages(messageKey: string, displayDuration: number): void{
    let message = messageKey;
    this.translateService.get(messageKey).subscribe((res: string) => {
      message = res;
    });
    this.snackBar.open(message, '', {
      duration: displayDuration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  generateEncodedFileURI(fileURL: string): string{
    if (fileURL === null || fileURL === undefined || fileURL === ''){
      return '';
    }else{
      return encodeURI(environment.apiUrl + '/file-server/get-file' + fileURL);
    }
  }

  displayModal(tab: string, messages: any): any{
    const dialogRef = this.dialog.open(ModalComponent, {
        width: '500px',
        id: 'common-modal',
        data: { tab: tab, messages: messages }
      });
      return dialogRef;
  }
  

  upload(filePath: string, file: File): any {
    let formData = new FormData();
    formData.append("filePath", filePath);
    if(null !== file){
      formData.append("file", file, file.name);
    }
    return this.http.post(environment.apiUrl + ApiConstants.UPLOAD_CONTENT_IMAGE,
            formData, {headers: this.getEmptyHeaders()});
  }

}

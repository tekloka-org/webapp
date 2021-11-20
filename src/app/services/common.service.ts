import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { ModalComponent } from '../components/modal/modal.component';
import { AngularEditorConfig } from '@kolkov/angular-editor';

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
    uploadUrl: 'v1/image',
    // upload: (file: File) => { ... }
    // uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
};

  constructor(private snackBar: MatSnackBar, public dialog: MatDialog) { }

  getJSONHeaders(): HttpHeaders {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return headers;
  }

  getEmptyHeaders(): HttpHeaders {
    const headers = new HttpHeaders();
    return headers;
  }

  displaySnackBarMessages(message: string, displayDuration: number): void{
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
  
}

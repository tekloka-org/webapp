import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalConstants } from 'src/app/constants/modal-constants';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  ADD_CATEGORY_MODAL = ModalConstants.ADD_CATEGORY_MODAL;

  addCategoryForm = new FormGroup({
    name : new FormControl('', [Validators.required]),
    urlPath : new FormControl('', [Validators.required])
  });

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any) { }

  ngOnInit(): void {
  }

  addCategory(){

  }

}

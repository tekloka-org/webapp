import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalConstants } from 'src/app/constants/modal-constants';
import { ResponseConstants } from 'src/app/constants/response-constants';
import { ApiResponse } from 'src/app/models/api-response';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';
import { CommonService } from 'src/app/services/common.service';
import { ModalComponent } from '../../common/modal/modal.component';

@Component({
  selector: 'app-category-support',
  templateUrl: './category-support.component.html',
  styleUrls: ['./category-support.component.scss']
})
export class CategorySupportComponent implements OnInit {

  ADD_CATEGORY_MODAL = ModalConstants.ADD_CATEGORY_MODAL;
  UPDATE_CATEGORY_MODAL = ModalConstants.UPDATE_CATEGORY_MODAL;
  DELETE_CATEGORY_MODAL = ModalConstants.DELETE_CATEGORY_MODAL;

  addForm = new FormGroup({
    name : new FormControl('', [Validators.required]),
    urlPath : new FormControl('', [Validators.required])
  });

  updateForm = new FormGroup({
    categoryId: new FormControl('', [Validators.required]),
    name : new FormControl('', [Validators.required]),
    urlPath : new FormControl('', [Validators.required])
  });

  deleteForm = new FormGroup({
    categoryId: new FormControl('', [Validators.required]),
    name : new FormControl('', [Validators.required]),
    urlPath : new FormControl('', [Validators.required])
  });

  selectedCategory: Category;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any, 
              private categoryService: CategoryService, private commonService: CommonService,
              private dialogRef: MatDialogRef<CategorySupportComponent>) { }

  ngOnInit(): void {
    
    this.selectedCategory = this.dialogData.messages?.category;
    if(this.dialogData.tab === this.UPDATE_CATEGORY_MODAL){
      this.updateForm.get('categoryId')?.setValue(this.selectedCategory?.categoryId);
      this.updateForm.get('name')?.setValue(this.selectedCategory?.name);
      this.updateForm.get('urlPath')?.setValue(this.selectedCategory?.urlPath);
    }

    if(this.dialogData.tab === this.DELETE_CATEGORY_MODAL){
      this.deleteForm.get('categoryId')?.setValue(this.selectedCategory?.categoryId);
      this.deleteForm.get('name')?.setValue(this.selectedCategory?.name);
      this.deleteForm.get('urlPath')?.setValue(this.selectedCategory?.urlPath);
    }

  }

  save(){
    if(this.addForm.valid){
      this.categoryService.saveCategory(this.addForm).subscribe((response: ApiResponse) => {
        if(response.code === ResponseConstants.CATEGORY_SAVED){
          const data = response.data as any;
          this.commonService.displaySnackBarMessages('added', 3000);
          this.dialogRef.close({ code: ResponseConstants.CATEGORY_SAVED, category: data.category });
        }
      });
    }
  }

  update(){
    if(this.updateForm.valid){
      this.categoryService.updateCategory(this.updateForm).subscribe((response: ApiResponse) => {
        if(response.code === ResponseConstants.CATEGORY_UPDATED){
          const data = response.data as any;
          this.commonService.displaySnackBarMessages('updated', 3000);
          this.dialogRef.close({ code: ResponseConstants.CATEGORY_UPDATED, category: data.category });
        }
      });
    }
  }

  delete(){
    if(this.deleteForm.valid){
      this.categoryService.deleteCategory(this.deleteForm).subscribe((response: ApiResponse) => {
        if(response.code === ResponseConstants.CATEGORY_DELETED){
          this.commonService.displaySnackBarMessages('deleted', 3000);
          this.dialogRef.close({ code: ResponseConstants.CATEGORY_DELETED});
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

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ModalConstants } from 'src/app/constants/modal-constants';
import { ResponseConstants } from 'src/app/constants/response-constants';
import { ApiResponse } from 'src/app/models/api-response';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';
import { CommonService } from 'src/app/services/common.service';
import { CategorySupportComponent } from '../category-support/category-support.component';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {

  dataSource:  MatTableDataSource<any>;
  displayedColumns: string[] ;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  constructor(private router: Router, private categoryService: CategoryService,
    private commonService: CommonService, private translateService: TranslateService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.displayedColumns = [ 'name', 'urlPath', 'actions'];
    this.categoryService.getAllCategories().subscribe((response: ApiResponse) => {
      if(response.code === ResponseConstants.CATEGORY_LIST_FOUND){
        const data = response.data as any;
        this.dataSource = new MatTableDataSource(data.categoryList);
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
    let messages = {
      title: 'Add Category'
    };
    this.translateService.get('category.add').subscribe((res: string) => {
      messages.title = res;
    });
    const dialogRef = this.dialog.open(CategorySupportComponent, {
      width: '500px',
      id: 'add-category-modal',
      data: { tab: ModalConstants.ADD_CATEGORY_MODAL, messages: messages }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result?.code === ResponseConstants.CATEGORY_SAVED) {
        const data = this.dataSource.data;
        data.unshift(result.category);
        this.dataSource.data = data;
      }
    });   
  }

  displayUpdatePage(index: number, category: Category){
    let messages = {
      title: 'Update Category',
      category: category
    };
    this.translateService.get('category.update').subscribe((res: string) => {
      messages.title = res;
    });
    const dialogRef = this.dialog.open(CategorySupportComponent, {
      width: '500px',
      id: 'update-category-modal',
      data: { tab: ModalConstants.UPDATE_CATEGORY_MODAL, messages: messages }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result?.code === ResponseConstants.CATEGORY_UPDATED) {
        const data = this.dataSource.data;
        data[index] = result.category;
        this.dataSource.data = data;
      }
    });
  }

  displayDeletePage(index: number, category: Category){
    let messages = {
      title: 'Delete Category',
      category: category
    };
    this.translateService.get('category.delete').subscribe((res: string) => {
      messages.title = res;
    });
    const dialogRef = this.dialog.open(CategorySupportComponent, {
      width: '500px',
      id: 'delete-category-modal',
      data: { tab: ModalConstants.DELETE_CATEGORY_MODAL, messages: messages }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result?.code === ResponseConstants.CATEGORY_DELETED) {
        const data = this.dataSource.data;
        data.splice(index, 1);
        this.dataSource.data = data;
      }
    });
  }

  generateEncodedFileURI(fileURL: string): string{
    if(fileURL !== null && fileURL !== undefined && fileURL !== ''){
      return this.commonService.generateEncodedFileURI(fileURL);
    }else{
      return '';
    }
  }

  // goToFoodItems(foodOutlet: FoodOutlet): void{
  //   this.foodOutletService.setSelectedFoodOutlet(foodOutlet);
  //   this.router.navigate(['/food-items']);
  // }


}

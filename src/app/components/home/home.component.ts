import { Component, OnInit } from '@angular/core';
import { ResponseConstants } from 'src/app/constants/response-constants';
import { ApiResponse } from 'src/app/models/api-response';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  categories: Category[];

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe((response: ApiResponse) => {
      if(response.code === ResponseConstants.CATEGORY_LIST_FOUND){
        const data = response.data as any;
        this.categories = data.categoryList as Category[];
      }
    });
  }

}

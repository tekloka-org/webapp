import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResponseConstants } from 'src/app/constants/response-constants';
import { ApiResponse } from 'src/app/models/api-response';
import { Page } from 'src/app/models/page';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-page-details',
  templateUrl: './page-details.component.html',
  styleUrls: ['./page-details.component.scss']
})
export class PageDetailsComponent implements OnInit {

  categoryUrlPath: string;
  pageUrlPath: string;

  page: Page;
  constructor(private route: ActivatedRoute, private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.route.parent?.params.subscribe(parentParams => {
      this.categoryUrlPath = parentParams['category-url-path'];
      this.route.params.subscribe(params => {
        this.pageUrlPath = params['page-url-path'];
        this.categoryService.getCategoryPage(this.categoryUrlPath, this.pageUrlPath).subscribe((response: ApiResponse) => {
          if(response.code === ResponseConstants.PAGE_FOUND){
            const data = response.data as any;
            this.page = data.page;
          }
        });
      });
    });
  }

}

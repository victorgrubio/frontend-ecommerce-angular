import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;
  pageNumber: number = 1;
  pageSize: number = 5;
  totalElements: number = 0;

  previousKeyword: string = null;

  constructor(private productService: ProductService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProducts(); // Get products initialy
    })
  }

  listProducts(){
    // check if the current route has the keyword element (search)
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode){
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();
    }
  }

  handleSearchProducts(){
    const keyword = this.route.snapshot.paramMap.get('keyword');
    // if we have a different  keyword set page to 1
    if (this.previousKeyword !== keyword){
      this.pageNumber = 1;
    }
    this.previousKeyword = keyword;
    this.productService.searchProductsPaginate(this.pageNumber - 1,
                                               this.pageSize,
                                               keyword).subscribe(this.processResult());
  }

  // Observable instance begins publishing values only when someone subscribes to it.
  // In this case we use the output of the method from the productService
  handleListProducts(){
    // this.route(active route).snapshot(status of route now).paramMap(map of all route params)
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId){
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id'); //+ to convert to number
    } else {
      // default to category 1
      this.currentCategoryId = 1;
    }

    // Check if we have a diffent category than previous to avoid reload
    // If we have a different category  than previous, them pageNumber = 1
    if (this.previousCategoryId !== this.currentCategoryId){
      this.pageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;


    this.productService.getProductListPaginate(this.pageNumber - 1,
                                               this.pageSize,
                                               this.currentCategoryId)
                                               .subscribe(this.processResult());
    }

  processResult(){
    return data => {
      this.products = data._embedded.products;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    }
  }

  updatePageSize(pageSize: number){
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.listProducts();
  }
}

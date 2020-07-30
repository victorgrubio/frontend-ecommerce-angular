import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-table.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[];
  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.listProducts();  // Get products initialy
  }

  // Observable instance begins publishing values only when someone subscribes to it.
  // In this case we use the output of the method from the productService
  listProducts(){
    this.productService.getProductList().subscribe(
      data => {
        this.products = data;
      }  
    )
  }

}

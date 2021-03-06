import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productUrl = `${environment.apiUrl}/products`;
  private categoryUrl = `${environment.apiUrl}/product-category`;

  constructor(private httpClient: HttpClient) { }

  getProductListPaginate( page: number,
                          pageSize: number,
                          categoryId: number): Observable<GetResponseProducts>{

    const searchUrl = `${this.productUrl}/search/findByCategoryId?id=${categoryId}`+
                            `&page=${page}&size=${pageSize}`
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  // Observables are used for passing messages between parts of the app
  // In this case, is used to parse the response from Spring into a list
  // of prodcuts. 
  // The getResponse is an interface that parametrizes the content of the response
  // We use the map operator to do this parametrization an store it into the observable
  getProductList(categoryId: number): Observable<Product[]>{
    const searchUrl = `${this.productUrl}/search/findByCategoryId?id=${categoryId}`
    return this.getProducts(searchUrl);
  }

  getProductCategories(): Observable<ProductCategory[]>{
    return  this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  searchProducts(keyword: string): Observable<Product[]>{
    const searchUrl = `${this.productUrl}/search/findByNameContaining?name=${keyword}`
    return this.getProducts(searchUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  searchProductsPaginate( page: number,
                          pageSize: number,
                          keyword: string): Observable<GetResponseProducts>{

  const searchUrl = `${this.productUrl}/search/findByNameContaining?name=${keyword}`+
        `&page=${page}&size=${pageSize}`
  return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProduct(productId: number): Observable<Product>{
    // build url based on the product id
    const productUrl = `${this.productUrl}/${productId}`;
    return this.httpClient.get<Product>(productUrl);
  }
}


interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size:number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}

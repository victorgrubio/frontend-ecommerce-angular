import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';
  constructor(private httpClient: HttpClient) { }

  // Observables are used for passing messages between parts of the app
  // In this case, is used to parse the response from Spring into a list
  // of prodcuts. 
  // The getResponse is an interface that parametrizes the content of the response
  // We use the map operator to do this parametrization an store it into the observable
  getProductList(categoryId: number): Observable<Product[]>{

    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`
    return  this.httpClient.get<GetResponse>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }
}


interface GetResponse {
  _embedded: {
    products: Product[];
  }
}


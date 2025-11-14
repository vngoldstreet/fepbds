import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  // GET request
  getResource(endpoint: string): Observable<any> {
    const url = `${endpoint}`;
    // console.log(url);

    return this.http.get(url);
  }
  getResourcewtoken(endpoint: string, token: string): Observable<any> {
    // const url = `${endpoint}?token=${token}`;
    const url = `${endpoint}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(url, { headers });
  }

  // POST request
  createResource(endpoint: string, token: string, data: any): Observable<any> {
    const url = `${endpoint}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post(url, data, { headers }).pipe(tap((res) => {}));
  }

  // PUT request
  updateResource(endpoint: string, token: string): Observable<any> {
    const url = `${endpoint}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.put(url, {}, { headers });
  }

  // PUT request
  updateResourceWithForm(
    endpoint: string,
    token: string,
    data: any
  ): Observable<any> {
    const url = `${endpoint}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.put(url, data, { headers });
  }
}

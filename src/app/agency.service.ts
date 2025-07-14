// department.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgencyService {
  private apiUrl = 'http://localhost:8080/api/departments';

  constructor(private http: HttpClient) {}

  

  create(dept: any): Observable<any> {
    return this.http.post(this.apiUrl, dept);
  }

  update(id: number, dept: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, dept);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

 getAll() {    
  return this.http.get(`${this.apiUrl}`);
}

search(keyword: string) {
  return this.http.get(`${this.apiUrl}/search`, { params: { keyword } });
}
     
}
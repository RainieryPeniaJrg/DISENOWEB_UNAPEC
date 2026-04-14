import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hotel, TouristSite, ReservationRequest, ReservationResponse } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class HotelService {
  private apiUrl = `${environment.apiUrl}/hotels`;

  constructor(private http: HttpClient) {}

  getAll(province?: string, category?: string, stars?: number): Observable<Hotel[]> {
    let params = new HttpParams();
    if (province) params = params.set('province', province);
    if (category) params = params.set('category', category);
    if (stars) params = params.set('stars', stars.toString());
    return this.http.get<Hotel[]>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Hotel> {
    return this.http.get<Hotel>(`${this.apiUrl}/${id}`);
  }

  getProvinces(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/provinces`);
  }

  reserve(id: number, request: ReservationRequest): Observable<ReservationResponse> {
    return this.http.post<ReservationResponse>(`${this.apiUrl}/${id}/reserve`, request);
  }
}

@Injectable({ providedIn: 'root' })
export class TouristSiteService {
  private apiUrl = `${environment.apiUrl}/touristsites`;

  constructor(private http: HttpClient) {}

  getAll(category?: string, province?: string): Observable<TouristSite[]> {
    let params = new HttpParams();
    if (category) params = params.set('category', category);
    if (province) params = params.set('province', province);
    return this.http.get<TouristSite[]>(this.apiUrl, { params });
  }

  getById(id: number): Observable<TouristSite> {
    return this.http.get<TouristSite>(`${this.apiUrl}/${id}`);
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`);
  }
}

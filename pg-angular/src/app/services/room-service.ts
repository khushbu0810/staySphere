import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Room } from '../model/Room';
import { globalUrl } from '../../globalUrl';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  constructor(private httpClient: HttpClient) { }

  private roomsSubject = new BehaviorSubject<Room[]>([]);
  rooms$ = this.roomsSubject.asObservable();

  private appUrl = `${globalUrl}/rooms`;

  addRoom(room: Room): Observable<Room> {
    return this.httpClient.post<Room>(this.appUrl, room);
  }

  getAllRooms(): void {
    this.httpClient.get<Room[]>(this.appUrl)
      .subscribe(data => this.roomsSubject.next(data));
  }

  getRoomById(id: number): Observable<Room> {
    return this.httpClient.get<Room>(`${this.appUrl}/${id}`);
  }

  updateRoom(id: number, room: Room): Observable<Room> {
    return this.httpClient.put<Room>(`${this.appUrl}/${id}`, room);
  }

  deleteRoom(id: number): Observable<string> {
    return this.httpClient.delete(`${this.appUrl}/${id}`, { responseType: 'text' })
      .pipe(tap(() => this.getAllRooms()));
  }

  assignRoomToTenant(roomId: number, tenantId: number): Observable<String> {
    return this.httpClient.post(`${this.appUrl}/assign/${roomId}/${tenantId}`, null, { responseType: 'text' });
  }

  vacateRoomFromTenant(tenantId: number): Observable<string> {
    return this.httpClient.post<string>(`${this.appUrl}/vacate/${tenantId}`, null);
  }

  getPgSummary() {
    return this.httpClient.get<any>(`${this.appUrl}/pg-summary`);
  }



}

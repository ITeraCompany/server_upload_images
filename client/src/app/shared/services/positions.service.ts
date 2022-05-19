import {Injectable} from '@angular/core'
import {HttpClient} from '@angular/common/http'
import {Category, Message, Position} from '../interfaces'
import {Observable} from 'rxjs'

@Injectable({
  providedIn:'root'
})
export class PositionsService {
  files: File[] = [];
  constructor(private http: HttpClient) {}

  fetch(categoryId: string): Observable<Position[]> {
    return this.http.get<Position[]>(`/api/position/${categoryId}`)
  }

  // create(position: Position): Observable<Position> {
  //   return this.http.post<Position>('/api/position', position)
  // }

  create(positions: Position[] , files: File[]): Observable<Position> {
    const fd = new FormData()


    for (let i = 0; i < files.length; i++) {
      // fd.append('image', files[i],files[i].name);
      fd.append("uploads[]", files[i], files[i]['name']);
      console.log(files[i].name)
    }

    fd.append('data', JSON.stringify(positions));

    return this.http.post<Position>('/api/position', fd)
  }

  remove(id: string): Observable<Message> {
    return this.http.delete<Message>(`/api/position/${id}`)
  }

  update(position: Position): Observable<Position> {
    return this.http.patch<Position>(`/api/position/${position.id}`, {
      name: position.name
    })
  }
}

import { Injectable } from '@angular/core';
import { throwError, Subject } from 'rxjs';
import { User } from "./user.interface";
import { catchError } from 'rxjs/operators'
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  public users: Subject<User[]> = new Subject();

  public selectedSubject : Subject<string> = new Subject();

  constructor(private http: HttpClient) { }

  getStaticData(selected: string): void {

    const url = `https://g1o0oqk0y7.execute-api.us-east-1.amazonaws.com/desk2U_test/${selected}`;
    this.http.get<any>(url, {})
      .pipe(
        catchError((e) => this.handleError(e))
      ).subscribe((response)=> {
        this.users.next(response as (User[]));
      });
  }

  private handleError(error: HttpErrorResponse) {
    console.log('error', error);
    // return an observable with a user-facing error message
    return throwError(
      'Internal Error.');
  };
}





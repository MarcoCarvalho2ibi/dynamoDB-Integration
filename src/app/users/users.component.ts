import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs/internal/Observable';
import { User } from "./user.interface";
import { UsersService } from "./users.service";
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

export interface UserData {
  created: number;
  time: string;
  name: string;
  email: string;
}

/**
 * @title Use of `mat-text-column` which can be used for simple columns that only need to display
 * a text value for the header and cells.
 */

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['created', 'time', 'name', 'email'];
  dataSource = new MatTableDataSource();
  datePipe = new DatePipe("en-US");
  users_test: any[] | undefined;
  private unsubscribe$ = new Subject<void>();


  usersData: Observable<User[]> = this.usersService.users;

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  @ViewChild(MatSort, {static: true})
  sort!: MatSort;

  constructor(private usersService: UsersService) {
    this.usersService.getStaticData('users');

  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.usersData.pipe(takeUntil(this.unsubscribe$)).subscribe((data)=> {
      this.dataSource.data = this.formatData(data);
      this.dataSource.sort = this.sort;
    });

  }

  /** Data accessor function that transforms the email value to have at most 2 decimal digits. */
  getDateTime = (data: User): any => {
    let date = new Date(data.created * 1000);

    const result = {created: this.datePipe.transform(date, 'dd/MM/yyyy'), time: this.datePipe.transform(date, 'hh:mm')};
    return result === null ? '' : result;
  }

  getName = (data: User): string => {
    let formData = JSON.parse(data.formData);

    const result = formData.name;
    return result === null ? '' : result;
  }

  getEmail = (data: User): string => {
    let formData = JSON.parse(data.formData);

    const result = formData.email;
    return result === null ? '' : result;
  }

  formatData(data: User[]): UserData[] {
    let user$: UserData;
    let formData: any;
    let users$: UserData[] = [];
    data.forEach(user => {
      user$ = {created:user.created, time: this.getDateTime(user).time ,name:this.getName(user), email:this.getEmail(user)};
      users$.push(user$);
    });

    return users$;
  }

  ngOnDestroy():void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}

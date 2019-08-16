import {Component, OnInit} from '@angular/core';
import {Course} from "../model/course";
import { interval, Observable, of, throwError, timer } from 'rxjs';
import { catchError, delayWhen, finalize, map, retryWhen, shareReplay, tap } from 'rxjs/operators';
import { createHttpObservable } from '../common/util';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  ngOnInit() {
    const http$ = createHttpObservable('/api/courses');

    const courses$ = http$.pipe(
      map(res => Object.values(res['payload']) as Course[]),
      shareReplay(),
      catchError(err => {
          console.log('Error occurred', err);
          return throwError(err);
      }),
      finalize(() => console.log('Finalize executed..'))
    );

    this.beginnerCourses$ = courses$.pipe(map(courses => courses.filter(c => c.category == 'BEGINNER')));
    this.advancedCourses$ = courses$.pipe(map(courses => courses.filter(c => c.category == 'ADVANCED')));

  }
}

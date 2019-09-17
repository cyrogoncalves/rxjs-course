import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { Course } from '../model/course';
import { createHttpObservable } from './util';
import { delayWhen, filter, map, retryWhen, shareReplay, tap } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class StoreService {

  private subject = new BehaviorSubject<Course[]>([]);
  courses$: Observable<Course[]> = this.subject.asObservable();

  init() {
    const http$ = createHttpObservable('/api/courses');

    http$.pipe(
      tap(() => console.log("HTTP request executed")),
      map(res => Object.values(res["payload"])),
    ).subscribe(this.subject.next);
  }

  selectBeginnersCourses = () => this.filter('BEGINNER');

  selectAdvancedCourses = () => this.filter('ADVANCED');

  private filter = (category: string) =>
    this.courses$.pipe(map(courses => courses.filter(course => course.category == category)))

}

class RxObservable<T> extends Observable<T> {
  filter = (f: ((T) => boolean)) => this.pipe(filter(f));
}

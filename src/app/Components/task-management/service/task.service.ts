import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TASKS_API } from 'src/app/theme/shared/constant/service-api.contant';
import { environment } from 'src/environments/environment';
import { ITask } from '../model/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(
    private http: HttpClient
  ) { }

  private refreshSubject = new BehaviorSubject<boolean>(false);
  refreshObservable$ = this.refreshSubject.asObservable();

  triggerRefresh() {
    this.refreshSubject.next(true);
  }

  getTasks(page: number, pageSize: number, search: string = ''): Observable<any> {
    return this.http.get(
      `${environment.BASE_URL}${TASKS_API.TASK_LIST}?page=${page}&pageSize=${pageSize}&search=${search}`
    );
  }

  createTask(task: ITask): Observable<any> {
    return this.http.post(environment.BASE_URL + TASKS_API.ADD_TASK, task);
  }

  updateTask(id: string, task: ITask): Observable<any> {
    return this.http.put(`${environment.BASE_URL}${TASKS_API.TASK_BY_ID}${id}`, task);
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${environment.BASE_URL}${TASKS_API.TASK_BY_ID}${id}`);
  }

}

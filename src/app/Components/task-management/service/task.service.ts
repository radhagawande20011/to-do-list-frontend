import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { from, map, Observable } from 'rxjs';
import { TASKS_API } from 'src/app/theme/shared/constant/service-api.contant';
import { environment } from 'src/environments/environment';

export interface ITask {
  id?: string;
  assignedTo: string;
  status: string;
  dueDate: string;
  priority: string;
  comments: string;
  createdAt?: string;
  updatedAt?: string;
}
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private supabase: SupabaseClient;

  constructor(
    private http: HttpClient
  ) {
    // this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  // ✅ Map frontend → DB format
  private mapToDb(task: ITask) {
    return {
      assigned_to: task.assignedTo,
      status: task.status,
      due_date: task.dueDate,
      priority: task.priority,
      comments: task.comments
    };
  }

  // ✅ Map DB → frontend format
  private mapFromDb(row: any): ITask {
    return {
      id: row.id,
      assignedTo: row.assigned_to,
      status: row.status,
      dueDate: row.due_date,
      priority: row.priority,
      comments: row.comments,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  // ✅ Convert Supabase Promise → Observable
  // getTasks(searchTerm: string = '', limit: number = 20, offset: number = 0) {
  //   let query = this.supabase
  //     .from('tasks')
  //     .select('*', { count: 'exact' })
  //     .order('created_at', { ascending: false })
  //     .range(offset, offset + limit - 1);

  //   if (searchTerm) {
  //     // ✅ Fix search column names (snake_case properly)
  //     query = query.or(`assigned_to.ilike.%${searchTerm}%,comments.ilike.%${searchTerm}%`);
  //   }

  //   return from(query).pipe(
  //     map((res: any) => ({
  //       data: res.data?.map((row: any) => this.mapFromDb(row)) || [],
  //       count: res.count
  //     }))
  //   );
  // }

  getTasks(page: number, pageSize: number): Observable<any> {
    return this.http.get(
      `${environment.BASE_URL}${TASKS_API.TASK_LIST}?page=${page}&pageSize=${pageSize}`
    );
  }


  // createTask(task: ITask) {
  //   return from(
  //     this.supabase
  //       .from('tasks')
  //       .insert([this.mapToDb(task)]) 
  //       .select()
  //   ).pipe(
  //     map((res: any) =>
  //       res.data ? this.mapFromDb(res.data[0]) : null
  //     )
  //   );
  // }

  createTask(task: ITask): Observable<any> {
    return this.http.post(environment.BASE_URL + TASKS_API.ADD_TASK, task);
  }

  updateTask(id: string, task: ITask): Observable<any> {
    return this.http.put(environment.BASE_URL + TASKS_API.EDIT_TASK, task);
  }


  // updateTask(id: string, task: Partial<ITask>) {
  //   return from(
  //     this.supabase
  //       .from('tasks')
  //       .update({
  //         ...this.mapToDb(task as ITask),
  //         updated_at: new Date().toISOString()
  //       })
  //       .eq('id', id)
  //       .select()
  //   ).pipe(
  //     map((res: any) =>
  //       res.data ? this.mapFromDb(res.data[0]) : null
  //     )
  //   );
  // }

  deleteTask(id: string) {
    return from(
      this.supabase
        .from('tasks')
        .delete()
        .eq('id', id)
    );
  }
}

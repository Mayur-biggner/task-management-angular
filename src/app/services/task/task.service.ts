import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.qa';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private _httpService: HttpService) {}

  getAllTasks(filters: any): Observable<any> {
    const tasksUrl = `${environment.apiEndPoint}task`;
    let params = new HttpParams();
    // Add filters if present
    if (filters.status) {
      params = params.set('status', filters.status);
    }
    if (filters.priority) {
      params = params.set('priority', filters.priority);
    }
    if (filters.assignee) {
      params = params.set('assignee', filters.assignee);
    }
    if (filters.dueDate) {
      params = params.set('dueDate', filters.dueDate);
    }
    if (filters.page) {
      params = params.set('page', filters.page);
    }
    if (filters.limit) {
      params = params.set('limit', filters.limit);
    }
    console.log(params);
    return this._httpService.request('get', tasksUrl, null, null, params);
  }

  creteTask(taskData: any): Observable<any> {
    const createTaskUrl = `${environment.apiEndPoint}task/`;
    return this._httpService.request('post', createTaskUrl, { ...taskData });
  }
  updateTask(taskId: string, taskData: any): Observable<any> {
    const updateTaskUrl = `${environment.apiEndPoint}task/${taskId}`;
    return this._httpService.request('put', updateTaskUrl, { ...taskData });
  }
  deleteTask(taskId: string): Observable<any> {
    const deleteTaskUrl = `${environment.apiEndPoint}task/${taskId}`;
    return this._httpService.request('delete', deleteTaskUrl);
  }
  assignTask(taskId: string, assignee: string): Observable<any> {
    const assignTaskUrl = `${environment.apiEndPoint}task/assign/${taskId}`;
    return this._httpService.request('post', assignTaskUrl, { assignee });
  }
}

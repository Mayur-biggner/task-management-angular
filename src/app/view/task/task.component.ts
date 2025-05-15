import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { Config } from 'datatables.net';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskComponent } from './add-task/add-task.component';
import { TaskService } from '../../services/task/task.service';
import { Subject } from 'rxjs';
import $ from 'jquery';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocalStorageService } from '../../services/localStorage/local-storage.service';
import { USER_ROLES } from '../../shared/constants';
import { AuthenticationService } from '../../services/login/authentication.service';
import { Router } from '@angular/router';

export interface user {
  id?: number;
  name: string;
  email: string;
  username: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  _id?: number;
  title: string;
  description: string;
  status: string;
  priority?: string;
  createdBy: user | null;
  assignee?: user | null;
  createdAt: Date;
  dueDate: Date;
}

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [DataTablesModule, CommonModule, MatButtonModule],
  providers: [DatePipe],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent implements OnInit, AfterViewInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: ADTSettings = {};
  dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
  tasks: Task[] = [];
  deletePermission: boolean = false;
  constructor(
    public dialog: MatDialog,
    private _taskService: TaskService,
    private _snackbar: MatSnackBar,
    private _localStorageService: LocalStorageService,
    private _datePipe: DatePipe,
    private _authService: AuthenticationService,
    private _router: Router
  ) {
    const role = _localStorageService.getRole();
    console.log('role', role);
    if (role) {
      this.deletePermission = role == USER_ROLES.ADMIN;
    }
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      serverSide: true, // Set the flag
      ajax: (dataTablesParameters: any, callback) => {
        this._taskService.getAllTasks(dataTablesParameters).subscribe({
          next: (response) => {
            console.log('response', response);
            this.tasks = response.tasks;
            callback({
              recordsTotal: response.total,
              data: response.tasks,
            });
          },
          error: (error) => {
            console.log('error', error);
          },
        });
      },
      columns: [
        {
          title: 'Title',
          data: 'title',
        },
        {
          title: 'Status',
          data: 'status',
        },
        {
          title: 'Priority',
          data: 'priority',
        },
        {
          title: 'Assignee',
          data: 'assignee.name',
          defaultContent: '-',
        },
        {
          title: 'Due Date',
          data: 'dueDate',
          defaultContent: '-',
          ngPipeInstance: this._datePipe,
        },
        {
          title: 'Action',
          render: function (data, type, row, meta) {
            const actions = `<button class="btn btn-sm btn-primary edit-task" data-id="${row._id}">Edit</button>
            <button class="btn btn-sm btn-primary delete-task" data-id="${row._id}">delete</button>`;
            const editActionOnly = `<button class="btn btn-sm btn-primary edit-task" data-id="${row._id}">Edit</button>`;

            return actions;
          },
        },
      ],
    };
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(this.dtOptions); // if you're using dtTrigger

    if (!this.deletePermission) {
      setTimeout(() => {
        $('.delete-task').remove();
      }, 0);
    }

    $(document).on('click', '.edit-task', (event) => {
      const id = $(event.currentTarget).data('id');
      console.log('event', id, event);
      console.log(this.tasks);
      const task = this.tasks.find((t) => t._id === id);
      if (task) {
        this.onEditTask(task);
      }
    });

    $(document).on('click', '.delete-task', (event) => {
      const id = $(event.currentTarget).data('id');
      console.log('event', id, event);
      console.log(this.tasks);
      const task = this.tasks.find((t) => t._id === id);
      if (task) {
        this.onDeleteTask(task._id);
      }
    });
  }

  onAddTask() {
    const dialogRef = this.dialog.open(AddTaskComponent, {
      ariaLabelledBy: 'add-task',
      height: '75vh',
      width: '75vw',
      hasBackdrop: false,
      // autoFocus: 'dialog',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      if (result) {
        this.onReload();
      }
    });
  }

  onEditTask(task: any) {
    const dialogRef = this.dialog.open(AddTaskComponent, {
      ariaLabelledBy: 'edit-task',
      height: '75vh',
      data: { ...task, assignee: task.assignee ? task.assignee._id : null },
      // autoFocus: 'dialog',
    });
    dialogRef.componentInstance.dailogTitle = 'Edit Task';
    dialogRef.componentInstance.type = 'Edit';

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      if (result) {
        this.onReload();
      }
    });
  }

  onDeleteTask(task_id: any) {
    console.log(task_id);
    this._taskService.deleteTask(task_id).subscribe({
      next: (response) => {
        console.log(response);
        this._snackbar.open(response.message, '', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
        this.onReload();
      },
      error: (error) => {
        console.log(error);
        this._snackbar.open(error.error.message, '', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
      },
    });
  }

  onReload() {
    this.dtElement.dtInstance.then((dtInstance) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next(this.dtOptions);
    });
  }

  onLogout() {
    this._authService.logout();
    this._localStorageService.clearLocalStorage();
    this._snackbar.open('Logged Out Successfully', '', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
    this._router.navigate(['/login']);
  }
}

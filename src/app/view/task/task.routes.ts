import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./task.component').then((m) => m.TaskComponent),
      },
      {
        path: 'taskDetails/:task_id',
        loadComponent: () =>
          import('./task-details/task-details.component').then(
            (m) => m.TaskDetailsComponent
          ),
      },
    ],
  },
];

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: '/tasks',
        pathMatch: 'full'
      },
      {
        path: 'tasks',
        loadComponent: () => import('./Components/task-management/task-list/task-list.component').then((c) => c.TaskListComponent)
      },
      // { path: 'tasks', loadChildren: () => import('./Components/task-management/tasks.module').then(m => m.TasksModule) },
    ]
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'guest',
        loadChildren: () => import('./demo/pages/authentication/authentication.module').then((m) => m.AuthenticationModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

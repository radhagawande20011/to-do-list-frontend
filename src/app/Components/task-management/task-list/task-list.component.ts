import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../service/task.service'
import { AddTaskComponent } from '../add-task/add-task.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ITask } from '../model/task.model';
import { ToastComponent } from 'src/app/theme/shared/toast/toast.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';


@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, AddTaskComponent, ToastComponent, NgxSkeletonLoaderModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
  providers: [TaskService, HttpClient],
})
export class TaskListComponent {
  tasks: ITask[] = [];
  totalCount: number = 0;
  totalPages: number = 0;
  searchTerm: string = '';
  pageSizeOptions: number[] = [10, 20, 50, 100];
  pageSize: number = 10;
  currentPage: number = 1;
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  selectedTask: ITask | null = null;
  isLoading: boolean = false;
  actionMenuTaskId: string | null = null;
  @ViewChild(ToastComponent) toast!: ToastComponent;


  constructor(private taskService: TaskService) { }

  ngOnInit() {
    this.getAllTasks();
    this.taskService.refreshObservable$.subscribe((refresh) => {
      if (refresh) {
        this.getAllTasks();
      }
    });
  }

  getAllTasks() {
    this.isLoading = true;

    this.taskService.getTasks(this.currentPage, this.pageSize, this.searchTerm).subscribe({
      next: (response) => {
        this.tasks = response.data;
        this.totalCount = response.total;
        this.totalPages = Math.ceil(response.total / this.pageSize);
        this.actionMenuTaskId = null;
      },
      error: (err) => {
        console.error('Error fetching tasks:', err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
  onSearch() {
    if (this.searchTerm.length >= 2 || this.searchTerm.length === 0) {
      this.currentPage = 1;
      this.getAllTasks();
    }
  }

  clearSearch() {
    this.searchTerm = '';
    this.currentPage = 1;
    this.getAllTasks();
  }

  goToFirstPage() {
    this.currentPage = 1;
    this.getAllTasks();
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getAllTasks();
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getAllTasks();
    }
  }

  goToLastPage() {
    this.currentPage = this.totalPages;
    this.getAllTasks();
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.getAllTasks();
  }

  refresh() {
    this.searchTerm = '';
    this.getAllTasks();
  }

  openAddTaskModal() {
    this.selectedTask = null;
    this.showAddModal = true;
  }

  onTaskFormSave(task: ITask) {
    this.closeModals();
    this.getAllTasks();
  }

  openEditModal(task: ITask) {
    this.selectedTask = { ...task };
    this.showEditModal = true;
  }

  closeModals() {
    this.showAddModal = false;
    this.showEditModal = false;
    this.selectedTask = null;
  }

    toggleActionMenu(taskId: string) {
    this.actionMenuTaskId = this.actionMenuTaskId === taskId ? null : taskId;
  }


  deleteTask(taskId: string) {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }
    this.actionMenuTaskId = null;
    this.getAllTasks();
  }

}
export { ITask };


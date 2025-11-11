import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
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

  // region variables
  tasks: ITask[] = [];
  totalCount: number = 0;
  totalPages: number = 0;
  searchTerm: string = '';
  pageSizeOptions: number[] = [5, 10, 20, 50,];
  pageSize: number = 10;
  currentPage: number = 1;
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  selectedTask: ITask | null = null;
  showDeleteModal = false;
  isLoading: boolean = false;
  actionMenuTaskId: string | null = null;
  @Output() notify = new EventEmitter<string>();

  @ViewChild(ToastComponent) toast!: ToastComponent;

  //#region common methods
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

  //#region pagination
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
    this.currentPage = 1;
    this.pageSize = 10;
    this.getAllTasks();
  }

  //#region add form
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

  //#region delete
  openDeleteModal(task: ITask) {
    this.selectedTask = task;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.selectedTask = null;
  }

  confirmDelete() {
    if (!this.selectedTask?.id) return;

    this.taskService.deleteTask(this.selectedTask.id)
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            this.toast.show(res.message || 'Task deleted successfully');

            this.showDeleteModal = false;
            this.getAllTasks();
          } else {
            this.toast.show('Something went wrong while deleting');
          }
        },
        error: (err) => {
          this.toast.show(err.error?.message || 'Failed to delete task');
        }
      });
  }
}
export { ITask };


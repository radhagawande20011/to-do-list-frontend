import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../service/task.service'
import { AddTaskComponent } from '../add-task/add-task.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';

export interface ITask {
  id?: string;
  assignedTo: string;
  status: string;
  dueDate: string;
  priority: string;
  comments: string;
}

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, AddTaskComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
  providers: [TaskService, HttpClient],
})
export class TaskListComponent {
  tasks: ITask[] = [];
  totalCount: number = 0;
  totalPages: number = 0;
  searchTerm: string = '';
  pageSize: number = 20;
  currentPage: number = 1;
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  selectedTask: ITask | null = null;
  actionMenuTaskId: string | null = null;

  constructor(private taskService: TaskService) { }

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks(this.currentPage, this.pageSize).subscribe((response) => {
      this.tasks = response;
      this.totalPages = Math.ceil(response.total / this.pageSize);
    });
  }

  async onSearch() {
    this.currentPage = 1;
    await this.loadTasks();
  }

  openAddTaskModal() {
    this.selectedTask = null;
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  async onAddTaskSave(task: ITask) {
    // const { error } = await this.TaskService.createTask(task);

    // if (error) {
    //   console.error('Error creating task:', error);
    //   alert('Error creating task');
    //   return;
    // }

    this.closeAddModal();
    await this.loadTasks();
  }

  toggleActionMenu(taskId: string) {
    this.actionMenuTaskId = this.actionMenuTaskId === taskId ? null : taskId;
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

  onTaskFormSave(task: ITask) {
  }


  async deleteTask(taskId: string) {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    // const { error } = await this.TaskService.deleteTask(taskId);

    // if (error) {
    //   console.error('Error deleting task:', error);
    //   alert('Error deleting task');
    //   return;
    // }

    this.actionMenuTaskId = null;
    await this.loadTasks();
  }

  async refresh() {
    await this.loadTasks();
  }

  // get totalPages(): number {
  //   return Math.ceil(this.totalCount / this.pageSize);
  // }

  goToFirstPage() {
    this.currentPage = 1;
    this.loadTasks();
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadTasks();
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadTasks();
    }
  }

  goToLastPage() {
    this.currentPage = this.totalPages;
    this.loadTasks();
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.loadTasks();
  }
}

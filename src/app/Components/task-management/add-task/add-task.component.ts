import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ITask } from '../task-list/task-list.component';
import { TaskService } from '../service/task.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
  providers: [TaskService, HttpClient],
})
export class AddTaskComponent {
  @Input() task: ITask | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<ITask>();
  @Output() notify = new EventEmitter<{ message: string; type: 'success' | 'error' }>();

  taskForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService) { }

  ngOnInit() {
    this.createForm();

    if (this.task) {
      this.taskForm.patchValue(this.task);
    }
  }

  createForm() {
    this.taskForm = this.fb.group({
      assignedTo: ['', Validators.required],
      status: ['Not Started', Validators.required],
      dueDate: [''],
      priority: ['Normal', Validators.required],
      comments: ['']
    });
  }

  onClose() {
    this.close.emit();
  }

  onSave() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const payload = this.taskForm.value as ITask;

    if (this.task?.id) {
      // UPDATE Flow
      this.taskService.updateTask(this.task.id, payload).subscribe({
        next: (res: any) => {
          if (res.success) {
            this.notify.emit({
              message: res.message || 'Task Updated Successfully',
              type: 'success'
            });
            this.save.emit(res.data);
            this.close.emit();
          } else {
            this.notify.emit({
              message: 'Something went wrong',
              type: 'error'
            });
          }
        },
        error: (err) => {
          this.notify.emit({
            message: err.error?.message || 'Failed to update task',
            type: 'error'
          });
        }

      });

    } else {
      // CREATE Flow
      this.taskService.createTask(payload).subscribe({
        next: (res: any) => {
          if (res.success) {
            this.notify.emit({
              message: res.message || 'Task Added Successfully',
              type: 'success'
            });
            this.save.emit(res.data);
            this.close.emit();
          } else {
            this.notify.emit({
              message: 'Something went wrong',
              type: 'error'
            });
          }

        },
        error: (err) => {
          this.notify.emit({
            message: err.error?.message || 'Failed to update task',
            type: 'error'
          });
        }
      });
    }
  }

  onCancel() {
    this.close.emit();
  }
}

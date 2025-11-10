import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ITask } from '../task-list/task-list.component';
import { TaskService } from '../service/task.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ToastComponent } from 'src/app/theme/shared/toast/toast.component';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ToastComponent],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
  providers: [TaskService, HttpClient],
})
export class AddTaskComponent {
  @Input() task: ITask | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<ITask>();
  @Output() notify = new EventEmitter<string>();


  taskForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService) {
  }

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

    const formValue = this.taskForm.value as ITask;

if (this.task?.id) {
  this.taskService.updateTask(this.task.id, formValue).subscribe({
    next: () => {
      this.notify.emit('✅ Task Updated Successfully');
      this.save.emit(formValue);
      this.close.emit();
    },
    error: () => this.notify.emit('❌ Failed to update task'),
  });
} else {
  this.taskService.createTask(formValue).subscribe({
    next: () => {
      this.notify.emit('✅ Task Added Successfully');
      this.save.emit(formValue);
      this.close.emit();
    },
    error: () => this.notify.emit('❌ Failed to add task'),
  });
}

  }

  onCancel() {
    this.close.emit();
  }
}

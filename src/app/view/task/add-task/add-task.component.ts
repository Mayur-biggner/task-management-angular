import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TaskService } from '../../../services/task/task.service';
import { TaskComponent, user } from '../task.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '../../../services/login/authentication.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [
    MatDatepickerModule, // ✅ Provide datepicker module
    MatNativeDateModule, // ✅ Provide native date adapter
  ],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})
export class AddTaskComponent {
  taskForm: FormGroup;

  assigneeData: Array<{ value: string; label: string }> | [] = [];
  @Input() type: 'Add' | 'Edit' = 'Add';
  @Input() dailogTitle = this.type === 'Add' ? 'Add New Task' : 'Edit Task';

  constructor(
    private _fb: FormBuilder,
    private _taskService: TaskService,
    private dialogRef: MatDialogRef<TaskComponent>,
    private _authenticationService: AuthenticationService,
    private _snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    _authenticationService.getUsers().subscribe({
      next: (response: any) => {
        // console.log(response);
        this.assigneeData = response.users.map((user: any) => ({
          value: user._id,
          label: user.username,
        }));
        // console.log(this.assigneeData);
      },
    });

    this.taskForm = this._fb.group({
      title: ['', Validators.required],
      description: [''],
      status: ['', Validators.required],
      priority: ['', Validators.required],
      assignee: [''],
      dueDate: ['', Validators.required],
      // image: [null],
    });

    if (data) {
      this.taskForm.patchValue({
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        assignee: data.assignee,
        dueDate: data.dueDate && data.dueDate.split('T')[0],
      });
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.taskForm.patchValue({ image: input.files[0] });
    }
  }

  onSubmit() {
    console.log('first');
    console.log(this.taskForm.value);
    if (this.taskForm.valid) {
      const { title, discription, status, priority, assignee, image } =
        this.taskForm.value;
      if (this.type == 'Add') {
        this._taskService.creteTask(this.taskForm.value).subscribe({
          next: (response: any) => {
            console.log(response);
            this._snackbar.open(response.message, '', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'end',
            });
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.log(error);
          },
        });
      } else {
        console.log(this.data._id);
        this._taskService
          .updateTask(this.data._id, this.taskForm.value)
          .subscribe({
            next: (response: any) => {
              console.log(response);
              this._snackbar.open(response.message, '', {
                duration: 3000,
                verticalPosition: 'top',
                horizontalPosition: 'end',
              });
              this.dialogRef.close(true);
            },
            error: (error) => {
              console.log(error);
            },
          });
      }
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}

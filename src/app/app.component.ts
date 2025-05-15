import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthenticationService } from './services/login/authentication.service';
import { LocalStorageService } from './services/localStorage/local-storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'task-management-webApp';

  constructor(
   
    private _localStorageService: LocalStorageService,
    private _snacbar: MatSnackBar,
    
  ) {}
}

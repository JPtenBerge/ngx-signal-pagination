import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgSignalPaginationComponent } from "./ng-signal-pagination/ng-signal-pagination.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgSignalPaginationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ng-signal-pagination';
}

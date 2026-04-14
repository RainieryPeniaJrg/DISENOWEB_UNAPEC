import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NavbarComponent],
  template: `
    <app-navbar *ngIf="isLoggedIn"></app-navbar>
    <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit {
  isLoggedIn = false;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.auth.isLoggedIn$.subscribe(v => this.isLoggedIn = v);
  }
}

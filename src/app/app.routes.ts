import { Routes } from '@angular/router';
import { TestComponent } from './test/test';

export const routes: Routes = [
  { path: '', redirectTo: 'test', pathMatch: 'full' },
  { path: 'test', component: TestComponent }
];

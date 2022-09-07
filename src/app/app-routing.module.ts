import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import {RouterModule, Routes} from '@angular/router';
import { NgModule } from '@angular/core';
import {TableComponent} from './table/table.component';

const routes: Routes = [
  {
    path: 'table',
    component: TableComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'login',
    component: LoginComponent
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

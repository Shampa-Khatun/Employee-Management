import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { AddEditEmployeeComponent } from './add-edit-employee/add-edit-employee.component';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';

const routes: Routes = [
  { path: 'employees', component: EmployeeListComponent },                    // /employees
  { path: 'add-employee', component: AddEditEmployeeComponent },     // /add-employee
  { path: 'edit-employee/:id', component: AddEditEmployeeComponent },// /edit-employee/:id
  { path: 'employees/:id', component: EmployeeDetailsComponent }               // /employees/:id
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeesRoutingModule { }

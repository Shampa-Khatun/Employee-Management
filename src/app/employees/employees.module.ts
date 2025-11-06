import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { EmployeesRoutingModule } from './employees-routing.module';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';
import { AddEditEmployeeComponent } from './add-edit-employee/add-edit-employee.component';


@NgModule({
  declarations: [
    EmployeeListComponent,
    EmployeeDetailsComponent,
    AddEditEmployeeComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EmployeesRoutingModule
  ]
})
export class EmployeesModule { }

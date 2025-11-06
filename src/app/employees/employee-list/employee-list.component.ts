import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../employee.service';
import { Employee } from '../employee.model';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  employees: Employee[] = [];

  constructor(private employeeService: EmployeeService, private router: Router) { }

  ngOnInit(): void {
    // json server theke data k fetch korbo ekhane
    this.employeeService.getEmployees().subscribe(data => {
      this.employees = data;
    });
  }

  addEmployee() {
    this.router.navigate(['/employees/add-employee']);
  }

  editEmployee(id: number) {
    this.router.navigate(['/employees/edit-employee', id]);
  }

  viewEmployee(id: number) {
    this.router.navigate(['/employees', id]);
  }

  deleteEmployee(id: number) {
    if(confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe(() => {
        this.employees = this.employees.filter(emp => emp.id !== id);
      });
    }
  }
}

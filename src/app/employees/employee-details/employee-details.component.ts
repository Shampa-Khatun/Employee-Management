import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../employee.service';
import { Employee } from '../employee.model';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent implements OnInit {
  employee: Employee | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.employeeService.getEmployee(+id).subscribe({
        next: emp => {
          this.employee = emp;
        },
        error: err => {
          this.employee = null;
        }
      });
    }
  }

  editEmployee(): void {
    if (this.employee?.id) {
      this.router.navigate(['/edit-employee', this.employee.id]);
    }
  }

  goBack(): void {
    this.router.navigate(['/employees']);
  }
}
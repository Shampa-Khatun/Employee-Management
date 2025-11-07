import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../employee.service';
import { Employee } from '../employee.model';
import { DEPARTMENT_OPTIONS } from 'src/app/shared/constants';
import { EmployeeFilterPipe } from '../employee-filter.pipe';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];

  filterForm: FormGroup;
  departmentOptions: string[] = DEPARTMENT_OPTIONS;

  currentPage = 1;
  itemsPerPage = 10;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute,
    private filterPipe: EmployeeFilterPipe
  ) {
    this.filterForm = this.fb.group({
      searchTerm: [''],
      selectedDepartment: [''],
      selectedRole: ['']
    });
  }

  ngOnInit(): void {
    // Load employees
    this.employeeService.getEmployees().subscribe(data => {
      this.employees = data;
      this.applyFilters();
    });

    // Listen to form changes
    this.filterForm.valueChanges.subscribe(() => this.applyFilters());

    // Initialize form from query params
    this.route.queryParams.subscribe(params => {
      this.filterForm.patchValue({
        searchTerm: params['search'] || '',
        selectedDepartment: params['department'] || '',
        selectedRole: params['role'] || ''
      }, { emitEvent: false });

       // Read page number from URL
    this.currentPage = params['page'] ? +params['page'] : 1;

      this.applyFilters(false);  // pass false so page doesn't reset to 1
    });
  }

  applyFilters(resetPage: boolean = true): void {
    const { searchTerm, selectedDepartment, selectedRole } = this.filterForm.value;

     if (resetPage) {
    this.currentPage = 1; // reset to first page only if resetPage is true
  }

      // Apply reusable pipe in TS
    this.filteredEmployees = this.filterPipe.transform(
      this.employees,
      searchTerm,
      selectedDepartment,
      selectedRole
    );
    // Update URL
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        search: searchTerm || null,
        department: selectedDepartment || null,
        role: selectedRole || null,
        page: this.currentPage !== 1 ? this.currentPage : null
      },
      queryParamsHandling: 'merge'
    });


  }

  get isFiltered(): boolean {
    const { searchTerm, selectedDepartment, selectedRole } = this.filterForm.value;
    return !!(searchTerm || selectedDepartment || selectedRole);
  }

  resetFilters() {
    this.filterForm.reset({
      searchTerm: '',
      selectedDepartment: '',
      selectedRole: ''
    });
    this.router.navigate(['/employees']);
    this.applyFilters();
  }

onPageChange(page: number) {
  this.currentPage = page;

  // Update URL only for page change
  this.router.navigate([], {
    relativeTo: this.route,
    queryParams: { page },
    queryParamsHandling: 'merge'
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
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe(() => {
        this.employees = this.employees.filter(emp => emp.id !== id);
        this.applyFilters();
      });
    }
  }
}

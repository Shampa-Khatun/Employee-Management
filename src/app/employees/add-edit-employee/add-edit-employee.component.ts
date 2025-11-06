import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../employee.service';
import { Employee } from '../employee.model';

@Component({
  selector: 'app-add-edit-employee',
  templateUrl: './add-edit-employee.component.html',
  styleUrls: ['./add-edit-employee.component.css']
})
export class AddEditEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  isEditMode = false;
  employeeId: number | null = null;

  departmentOptions: string[] = ['IT', 'HR', 'Finance', 'Marketing', 'SQA'];
  skillOptions: string[] = ['Angular', 'React', 'Vue', 'Node.js', 'Python', 'Java'];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required],
      role: ['', Validators.required],
      address: ['', Validators.required],
      skills: this.fb.array([])
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.employeeId = +id;
      this.loadEmployee(this.employeeId);
    }
  }

  get skills(): FormArray {
    return this.employeeForm.get('skills') as FormArray;
  }

  addSkill(): void {
    this.skills.push(this.fb.control('', Validators.required));
  }

  removeSkill(index: number): void {
    this.skills.removeAt(index);
  }

  private loadEmployee(id: number): void {
    this.employeeService.getEmployee(id).subscribe(employee => {
      this.employeeForm.patchValue({
        name: employee.name,
        email: employee.email,
        department: employee.department,
        role: employee.role,
        address: employee.address
      });
      
      // Clear existing skills and add new ones
      while (this.skills.length) {
        this.skills.removeAt(0);
      }
      
      employee.skills.forEach(skill => {
        this.skills.push(this.fb.control(skill, Validators.required));
      });
    });
  }

   onSubmit(): void {
    if (!this.employeeForm.valid) {
      this.markFormGroupTouched(this.employeeForm);
      return;
    }

    let employee: Employee = this.employeeForm.value;

    if (this.isEditMode && this.employeeId) {
      // Edit mode
      this.employeeService.updateEmployee(this.employeeId, employee).subscribe(() => {
        this.router.navigate(['/employees']);
      });
    } else {
      // Add mode
      this.employeeService.getEmployees().subscribe(allEmployees => {
        // Assign serial ID based on current list length
        employee = {
          ...employee,
          id: allEmployees.length + 1
        };

        this.employeeService.addEmployee(employee).subscribe(() => {
          this.router.navigate(['/employees']);
        });
      });
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../employee.service';
import { Employee } from '../employee.model';
import { DEPARTMENT_OPTIONS } from 'src/app/shared/constants';
import { SKILL_OPTIONS } from 'src/app/shared/constants';

@Component({
  selector: 'app-add-edit-employee',
  templateUrl: './add-edit-employee.component.html',
  styleUrls: ['./add-edit-employee.component.css']
})
export class AddEditEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  isEditMode = false;
  employeeId: number | null = null;
  Message: string | null = null;


  departmentOptions:string[] = DEPARTMENT_OPTIONS;
  skillOptions: string[] = SKILL_OPTIONS;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required],
      role: ['', Validators.required],
      address: [''],
      skills: this.fb.array([], Validators.required)
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.employeeId = +id;
      this.loadEmployee(this.employeeId);
    } else {
      this.addSkill();
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
  this.employeeService.getEmployee(id).subscribe({
    next: (employee) => {
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
    },
    error: () => {
      this.Message = 'Employee not found. Redirecting...';
      setTimeout(() => {
        this.router.navigate(['/employees']);
      }, 500);
    }
  });
}
   onSubmit(): void {
    this.Message = null;
    if (!this.employeeForm.valid) {
      this.markFormGroupTouched(this.employeeForm);
       this.Message = 'Required fields are still empty!';
      return;
    }

    const employee: Employee = this.employeeForm.value;

    if (this.isEditMode && this.employeeId) {

      // Edit mode
      this.employeeService.updateEmployee(this.employeeId, employee).subscribe(() => {
        //alert('Are you want to update these info?');
        this.Message = 'Employee Updated Successfully!';
        setTimeout(()=> {
        this.router.navigate(['/employees']);},1500);
      });
    } else {
      // this.employeeService.getEmployees().subscribe(allEmployees => {
      //   employee = {
      //     ...employee,
      //     id: allEmployees.length + 1
      //   };
;
        this.employeeService.addEmployee(employee).subscribe(() => {
          //alert('Are you want to add this employee?');
          this.Message = 'Employee added successfully!';
          setTimeout(()=> {
          this.router.navigate(['/employees']);},1500);
        });
      };
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
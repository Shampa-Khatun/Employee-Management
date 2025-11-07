import { Pipe, PipeTransform } from '@angular/core';
import { Employee } from './employee.model';

@Pipe({
  name: 'employeeFilter',
  pure: false // needed for dynamic updates
})
export class EmployeeFilterPipe implements PipeTransform {
  transform(
    employees: Employee[],
    searchTerm: string,
    department: string,
    role: string
  ): Employee[] {
    if (!employees) return [];

    return employees.filter(emp => {
      const matchesSearch = searchTerm
        ? emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.email.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      const matchesDept = department ? emp.department === department : true;
      const matchesRole = role
        ? emp.role.toLowerCase().includes(role.toLowerCase())
        : true;

      return matchesSearch && matchesDept && matchesRole;
    });
  }
}

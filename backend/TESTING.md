# Testing Guide - BitFlow Admin Portal

## Overview

This document provides a complete guide to the testing infrastructure for the BitFlow Admin Portal backend. The test suite ensures code quality, validates business logic, and prevents regressions.

## Test Structure

```
tests/
├── TestCase.php              # Base test case class
├── CreatesApplication.php    # Application bootstrap trait
├── Unit/                     # Unit tests for models
│   ├── DepartmentTest.php   # Department model tests (10 tests)
│   ├── StudentTest.php      # Student model tests (14 tests)
│   └── FacultyTest.php      # Faculty model tests (16 tests)
└── Feature/                  # Integration/API tests
    └── DepartmentApiTest.php # Department API tests (13 tests)
```

## Configuration

### PHPUnit Configuration (`phpunit.xml`)

The test suite uses SQLite in-memory database for fast, isolated testing:

```xml
<php>
    <env name="APP_ENV" value="testing"/>
    <env name="APP_KEY" value="base64:test1234567890abcdefghijklmnopqrstuvwxyz="/>
    <env name="BCRYPT_ROUNDS" value="4"/>
    <env name="CACHE_DRIVER" value="array"/>
    <env name="DB_CONNECTION" value="sqlite"/>
    <env name="DB_DATABASE" value=":memory:"/>
    <env name="MAIL_MAILER" value="array"/>
    <env name="QUEUE_CONNECTION" value="sync"/>
    <env name="SESSION_DRIVER" value="array"/>
    <env name="TELESCOPE_ENABLED" value="false"/>
</php>
```

### Key Benefits of This Configuration:
- **Fast**: In-memory SQLite is much faster than PostgreSQL for tests
- **Isolated**: Each test suite gets a fresh database
- **No Setup**: No need to configure a separate test database
- **CI-Friendly**: Works on any machine without external dependencies

## Running Tests

### Run All Tests
```bash
php artisan test
```

### Run Specific Test Suite
```bash
# Run all unit tests
php artisan test --testsuite=Unit

# Run all feature tests
php artisan test --testsuite=Feature
```

### Run Specific Test File
```bash
# Run Department model tests
php artisan test --filter=DepartmentTest

# Run Student model tests
php artisan test --filter=StudentTest

# Run Faculty model tests
php artisan test --filter=FacultyTest

# Run Department API tests
php artisan test --filter=DepartmentApiTest
```

### Run Specific Test Method
```bash
# Run a single test
php artisan test --filter="DepartmentTest::test_department_belongs_to_university"
```

### Run Tests with Coverage (requires Xdebug)
```bash
php artisan test --coverage
```

## Unit Tests

### DepartmentTest.php (10 Tests)

Tests the Department model relationships, scopes, and business logic.

**Relationship Tests:**
- ✅ `test_department_belongs_to_university` - Verifies belongsTo University relationship
- ✅ `test_department_belongs_to_college` - Verifies belongsTo College relationship
- ✅ `test_department_has_many_students` - Verifies hasMany Students relationship
- ✅ `test_department_has_many_faculty` - Verifies hasMany Faculty relationship
- ✅ `test_department_can_have_hod` - Verifies head of department relationship

**Scope Tests:**
- ✅ `test_department_active_scope` - Tests active() scope filtering
- ✅ `test_department_inactive_scope` - Tests inactive() scope filtering
- ✅ `test_department_for_college_scope` - Tests forCollege($id) scope filtering

**Business Logic Tests:**
- ✅ `test_department_code_is_unique_per_college` - Validates unique code constraint
- ✅ `test_department_soft_deletes` - Verifies soft delete functionality

### StudentTest.php (14 Tests)

Tests the Student model with comprehensive coverage of relationships, scopes, and constraints.

**Relationship Tests:**
- ✅ `test_student_belongs_to_user` - Verifies belongsTo User relationship
- ✅ `test_student_belongs_to_university` - Verifies belongsTo University relationship
- ✅ `test_student_belongs_to_college` - Verifies belongsTo College relationship
- ✅ `test_student_belongs_to_department` - Verifies belongsTo Department relationship
- ✅ `test_student_has_many_enrollments` - Verifies hasMany Enrollments relationship
- ✅ `test_student_has_active_enrollments` - Tests activeEnrollments() method
- ✅ `test_student_has_many_attendance_records` - Verifies hasMany Attendance relationship

**Scope Tests:**
- ✅ `test_student_active_scope` - Tests active() scope filtering
- ✅ `test_student_suspended_scope` - Tests suspended() scope filtering
- ✅ `test_student_graduated_scope` - Tests graduated() scope filtering
- ✅ `test_student_year_scope` - Tests year($year) scope filtering
- ✅ `test_student_for_college_scope` - Tests forCollege($id) scope filtering

**Business Logic Tests:**
- ✅ `test_student_admission_number_is_unique_per_university` - Validates unique admission number
- ✅ `test_student_soft_deletes` - Verifies soft delete functionality

### FacultyTest.php (16 Tests)

Tests the Faculty model including relationships, scopes, and custom attributes.

**Relationship Tests:**
- ✅ `test_faculty_belongs_to_user` - Verifies belongsTo User relationship
- ✅ `test_faculty_belongs_to_university` - Verifies belongsTo University relationship
- ✅ `test_faculty_belongs_to_college` - Verifies belongsTo College relationship
- ✅ `test_faculty_belongs_to_department` - Verifies belongsTo Department relationship
- ✅ `test_faculty_can_be_head_of_departments` - Verifies headOfDepartments() relationship

**Scope Tests:**
- ✅ `test_faculty_active_scope` - Tests active() scope filtering
- ✅ `test_faculty_on_leave_scope` - Tests onLeave() scope filtering
- ✅ `test_faculty_designation_scope` - Tests designation($designation) scope filtering
- ✅ `test_faculty_for_college_scope` - Tests forCollege($id) scope filtering
- ✅ `test_faculty_for_department_scope` - Tests forDepartment($id) scope filtering

**Business Logic Tests:**
- ✅ `test_faculty_employee_id_is_unique_per_university` - Validates unique employee ID
- ✅ `test_faculty_soft_deletes` - Verifies soft delete functionality
- ✅ `test_faculty_is_department_head_method` - Tests isDepartmentHead() helper method
- ✅ `test_faculty_years_of_service_attribute` - Tests years_of_service computed attribute

**Attribute Tests:**
- ✅ `test_faculty_name_attribute_from_user` - Tests name accessor from related user
- ✅ `test_faculty_email_attribute_from_user` - Tests email accessor from related user
- ✅ `test_faculty_phone_attribute_from_user` - Tests phone accessor from related user
- ✅ `test_faculty_salary_is_hidden` - Verifies salary is hidden in JSON output

## Feature/Integration Tests

### DepartmentApiTest.php (13 Tests)

Tests the Department CRUD API endpoints with authentication and authorization.

**CRUD Tests:**
- ✅ `test_can_list_departments` - GET /departments returns all departments
- ✅ `test_can_create_department` - POST /departments creates new department
- ✅ `test_can_get_single_department` - GET /departments/{id} returns single department
- ✅ `test_can_update_department` - PUT /departments/{id} updates department
- ✅ `test_can_delete_department` - DELETE /departments/{id} soft deletes department

**Validation Tests:**
- ✅ `test_cannot_create_department_with_duplicate_code` - Validates unique code constraint
- ✅ `test_cannot_create_department_without_required_fields` - Validates required fields

**Authorization Tests:**
- ✅ `test_cannot_access_departments_without_authentication` - Returns 401 for unauthenticated
- ✅ `test_cannot_access_departments_with_invalid_role` - Returns 403 for unauthorized role

**Data Isolation Tests:**
- ✅ `test_can_filter_active_departments` - Tests status filtering
- ✅ `test_department_belongs_to_correct_college` - Validates tenant isolation

**Security Tests:**
- ✅ `test_rate_limiting_on_department_endpoints` - Verifies 60/min rate limit

## Test Patterns and Best Practices

### 1. RefreshDatabase Trait

All tests use `RefreshDatabase` trait for clean database state:

```php
use Illuminate\Foundation\Testing\RefreshDatabase;

class DepartmentTest extends TestCase
{
    use RefreshDatabase;
}
```

### 2. Test Fixtures in setUp()

Create reusable test data in `setUp()` method:

```php
protected function setUp(): void
{
    parent::setUp();

    $this->university = University::create([...]);
    $this->college = College::create([...]);
    $this->department = Department::create([...]);
}
```

### 3. Descriptive Test Names

Use clear, descriptive test method names:

```php
// Good
public function test_department_belongs_to_university(): void

// Bad
public function testRelationship(): void
```

### 4. Arrange-Act-Assert Pattern

Structure tests clearly:

```php
public function test_can_create_department(): void
{
    // Arrange
    $departmentData = ['name' => 'CS', 'code' => 'CS01'];
    
    // Act
    $response = $this->postJson('/api/departments', $departmentData);
    
    // Assert
    $response->assertStatus(201);
    $this->assertDatabaseHas('departments', $departmentData);
}
```

### 5. Test One Thing Per Test

Each test should verify a single behavior:

```php
// Good - tests one relationship
public function test_department_has_many_students(): void
{
    $student = Student::create([...]);
    $this->assertEquals(1, $this->department->students()->count());
}

// Bad - tests multiple things
public function test_department_relationships(): void
{
    // Tests students, faculty, college all in one test
}
```

## Adding New Tests

### Creating a New Unit Test

1. Create test file in `tests/Unit/`:
```bash
php artisan make:test ModelNameTest --unit
```

2. Add test fixtures in `setUp()`:
```php
protected function setUp(): void
{
    parent::setUp();
    // Create necessary test data
}
```

3. Write tests following naming convention:
```php
public function test_model_does_something(): void
{
    // Test code
}
```

### Creating a New Feature Test

1. Create test file in `tests/Feature/`:
```bash
php artisan make:test ModelNameApiTest
```

2. Add authentication setup:
```php
protected function setUp(): void
{
    parent::setUp();
    
    $this->user = User::create([...]);
    $this->token = JWTAuth::fromUser($this->user);
}
```

3. Write API tests with authentication headers:
```php
public function test_can_access_endpoint(): void
{
    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->getJson('/api/endpoint');
    
    $response->assertStatus(200);
}
```

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.3'
          extensions: mbstring, xml, ctype, sqlite
          
      - name: Install Dependencies
        run: composer install --no-interaction --prefer-dist
        
      - name: Run Tests
        run: php artisan test
```

## Coverage Goals

### Current Coverage
- Unit Tests: 40 tests covering Department, Student, Faculty models
- Feature Tests: 13 tests covering Department API endpoints
- Total: 53 tests

### Target Coverage
- Models: 80%+ coverage of all model methods and relationships
- Controllers: 80%+ coverage of all CRUD operations
- Policies: 100% coverage of all authorization rules
- Overall: 75%+ total code coverage

## Troubleshooting

### Tests Fail with Database Errors

**Issue**: `SQLSTATE[08006] connection refused`
**Solution**: Ensure `phpunit.xml` is configured to use SQLite:
```xml
<env name="DB_CONNECTION" value="sqlite"/>
<env name="DB_DATABASE" value=":memory:"/>
```

### Tests Fail with "Class TestCase not found"

**Issue**: Missing base TestCase class
**Solution**: Ensure `tests/TestCase.php` and `tests/CreatesApplication.php` exist

### Slow Test Execution

**Issue**: Tests take too long to run
**Solutions**:
- Use SQLite in-memory database (not PostgreSQL)
- Set `BCRYPT_ROUNDS` to `4` in phpunit.xml
- Use `php artisan test --parallel` for parallel execution

### JWT Token Issues in API Tests

**Issue**: "Token could not be parsed"
**Solution**: Ensure you're using `JWTAuth::fromUser($user)` to generate tokens

## Next Steps

### Recommended Additional Tests

1. **Student API Tests** (`tests/Feature/StudentApiTest.php`)
   - CRUD operations
   - Enrollment validation
   - Bulk import functionality

2. **Faculty API Tests** (`tests/Feature/FacultyApiTest.php`)
   - CRUD operations
   - Assignment as HOD
   - Department filtering

3. **Policy Tests** (`tests/Unit/Policies/`)
   - DepartmentPolicy authorization
   - StudentPolicy authorization
   - FacultyPolicy authorization

4. **College Model Tests** (`tests/Unit/CollegeTest.php`)
   - Relationships
   - Scopes
   - Business logic

5. **University Model Tests** (`tests/Unit/UniversityTest.php`)
   - Relationships
   - Storage quota calculations
   - Tenant isolation

## Resources

- [Laravel Testing Documentation](https://laravel.com/docs/11.x/testing)
- [PHPUnit Documentation](https://phpunit.de/documentation.html)
- [Test-Driven Development Guide](https://martinfowler.com/bliki/TestDrivenDevelopment.html)

## Summary

The BitFlow Admin Portal has a comprehensive test suite with:
- ✅ 40 unit tests for models (Department, Student, Faculty)
- ✅ 13 feature tests for API endpoints
- ✅ SQLite in-memory database for fast execution
- ✅ JWT authentication testing
- ✅ Rate limiting verification
- ✅ Authorization testing
- ✅ Comprehensive relationship coverage

All tests follow Laravel best practices and use the RefreshDatabase trait for isolation. The test suite provides a solid foundation for maintaining code quality and preventing regressions as the application grows.

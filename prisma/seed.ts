import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  // ============================================================================
  // 1. Seed Master Schema (PUBLIC) - Universities
  // ============================================================================
  console.log('📚 Creating Universities...');
  
  const universities = await Promise.all([
    prisma.university.upsert({
      where: { slug: 'demo-university-1' },
      update: {},
      create: {
        name: 'Demo University Alpha',
        slug: 'demo-university-1',
        subdomain: 'alpha',
        domain: null,
        email: 'contact@alpha.edu',
        phone: '+1-555-0101',
        address: '123 Education Street, Learning City, LC 12345',
        establishedYear: 1995,
        timezone: 'America/New_York',
        status: 'live',
        storageQuotaGb: 1000,
        storageUsedMb: 0,
        branding: {
          primary_color: '#1E40AF',
          logo_url: 'https://via.placeholder.com/200x80?text=Alpha+University',
          favicon_url: 'https://via.placeholder.com/32x32?text=A'
        },
        settings: {
          features: {
            chat_enabled: true,
            fees_module: true,
            library_module: true,
            placement_module: true
          },
          academic: {
            current_academic_year: '2024-2025',
            grading_system: 'GPA'
          }
        },
        active: true
      }
    }),
    
    prisma.university.upsert({
      where: { slug: 'demo-university-2' },
      update: {},
      create: {
        name: 'Beta Institute of Technology',
        slug: 'demo-university-2',
        subdomain: 'beta',
        domain: 'beta-tech.edu',
        email: 'info@beta-tech.edu',
        phone: '+1-555-0202',
        address: '456 Tech Boulevard, Innovation Park, IP 67890',
        establishedYear: 2005,
        timezone: 'America/Los_Angeles',
        status: 'live',
        storageQuotaGb: 500,
        storageUsedMb: 125000,
        branding: {
          primary_color: '#059669',
          logo_url: 'https://via.placeholder.com/200x80?text=Beta+Tech',
          favicon_url: 'https://via.placeholder.com/32x32?text=B'
        },
        settings: {
          features: {
            chat_enabled: true,
            fees_module: true,
            library_module: false,
            placement_module: true
          },
          academic: {
            current_academic_year: '2024-2025',
            grading_system: 'Percentage'
          }
        },
        active: true
      }
    }),
    
    prisma.university.upsert({
      where: { slug: 'demo-university-3' },
      update: {},
      create: {
        name: 'Gamma College of Arts & Science',
        slug: 'demo-university-3',
        subdomain: 'gamma',
        domain: null,
        email: 'admissions@gamma-college.edu',
        phone: '+1-555-0303',
        address: '789 Campus Drive, University Town, UT 11223',
        establishedYear: 1980,
        timezone: 'America/Chicago',
        status: 'setup',
        storageQuotaGb: 250,
        storageUsedMb: 0,
        branding: {
          primary_color: '#DC2626',
          logo_url: 'https://via.placeholder.com/200x80?text=Gamma+College',
          favicon_url: 'https://via.placeholder.com/32x32?text=G'
        },
        settings: {
          features: {
            chat_enabled: false,
            fees_module: true,
            library_module: true,
            placement_module: false
          },
          academic: {
            current_academic_year: '2024-2025',
            grading_system: 'CGPA'
          }
        },
        active: true
      }
    })
  ]);
  
  console.log(`✅ Created ${universities.length} universities\n`);

  // ============================================================================
  // 2. Seed TENANT Schema - Roles
  // ============================================================================
  console.log('👥 Creating Roles...');
  
  const roles = await Promise.all([
    // Level 1: Platform Owners
    prisma.role.upsert({
      where: { slug: 'bitflow-owner' },
      update: {},
      create: {
        slug: 'bitflow-owner',
        name: 'Bitflow Owner',
        level: 1,
        scope: 'global',
        description: 'Platform owner with God Mode access to all universities'
      }
    }),
    
    prisma.role.upsert({
      where: { slug: 'bitflow-admin' },
      update: {},
      create: {
        slug: 'bitflow-admin',
        name: 'Bitflow Admin',
        level: 1,
        scope: 'global',
        description: 'Platform administrator with elevated access'
      }
    }),
    
    // Level 2: University Owners
    prisma.role.upsert({
      where: { slug: 'university-owner' },
      update: {},
      create: {
        slug: 'university-owner',
        name: 'University Owner',
        level: 2,
        scope: 'university',
        description: 'Owner of a university with full control'
      }
    }),
    
    prisma.role.upsert({
      where: { slug: 'university-admin' },
      update: {},
      create: {
        slug: 'university-admin',
        name: 'University Admin',
        level: 2,
        scope: 'university',
        description: 'Administrator at university level'
      }
    }),
    
    // Level 3: College Management
    prisma.role.upsert({
      where: { slug: 'college-principal' },
      update: {},
      create: {
        slug: 'college-principal',
        name: 'College Principal',
        level: 3,
        scope: 'college',
        description: 'Principal managing a college'
      }
    }),
    
    prisma.role.upsert({
      where: { slug: 'college-vice-principal' },
      update: {},
      create: {
        slug: 'college-vice-principal',
        name: 'College Vice Principal',
        level: 3,
        scope: 'college',
        description: 'Vice principal at college level'
      }
    }),
    
    prisma.role.upsert({
      where: { slug: 'college-admin' },
      update: {},
      create: {
        slug: 'college-admin',
        name: 'College Admin',
        level: 3,
        scope: 'college',
        description: 'Administrative staff at college level'
      }
    }),
    
    // Level 4: Department Level
    prisma.role.upsert({
      where: { slug: 'hod' },
      update: {},
      create: {
        slug: 'hod',
        name: 'Head of Department (HOD)',
        level: 4,
        scope: 'department',
        description: 'Head of a department'
      }
    }),
    
    // Level 5: Faculty & Staff
    prisma.role.upsert({
      where: { slug: 'professor' },
      update: {},
      create: {
        slug: 'professor',
        name: 'Professor',
        level: 5,
        scope: 'department',
        description: 'Senior teaching faculty'
      }
    }),
    
    prisma.role.upsert({
      where: { slug: 'associate-professor' },
      update: {},
      create: {
        slug: 'associate-professor',
        name: 'Associate Professor',
        level: 5,
        scope: 'department',
        description: 'Mid-level teaching faculty'
      }
    }),
    
    prisma.role.upsert({
      where: { slug: 'assistant-professor' },
      update: {},
      create: {
        slug: 'assistant-professor',
        name: 'Assistant Professor',
        level: 5,
        scope: 'department',
        description: 'Junior teaching faculty'
      }
    }),
    
    prisma.role.upsert({
      where: { slug: 'lecturer' },
      update: {},
      create: {
        slug: 'lecturer',
        name: 'Lecturer',
        level: 5,
        scope: 'department',
        description: 'Teaching staff'
      }
    }),
    
    prisma.role.upsert({
      where: { slug: 'lab-assistant' },
      update: {},
      create: {
        slug: 'lab-assistant',
        name: 'Lab Assistant',
        level: 5,
        scope: 'department',
        description: 'Laboratory support staff'
      }
    }),
    
    prisma.role.upsert({
      where: { slug: 'librarian' },
      update: {},
      create: {
        slug: 'librarian',
        name: 'Librarian',
        level: 5,
        scope: 'college',
        description: 'Library management staff'
      }
    }),
    
    prisma.role.upsert({
      where: { slug: 'accountant' },
      update: {},
      create: {
        slug: 'accountant',
        name: 'Accountant',
        level: 5,
        scope: 'college',
        description: 'Finance and accounting staff'
      }
    }),
    
    prisma.role.upsert({
      where: { slug: 'receptionist' },
      update: {},
      create: {
        slug: 'receptionist',
        name: 'Receptionist',
        level: 5,
        scope: 'college',
        description: 'Front desk staff'
      }
    }),
    
    // Level 6: Students & Parents
    prisma.role.upsert({
      where: { slug: 'student' },
      update: {},
      create: {
        slug: 'student',
        name: 'Student',
        level: 6,
        scope: 'college',
        description: 'Enrolled student'
      }
    }),
    
    prisma.role.upsert({
      where: { slug: 'parent' },
      update: {},
      create: {
        slug: 'parent',
        name: 'Parent/Guardian',
        level: 6,
        scope: 'college',
        description: 'Parent or guardian of a student'
      }
    })
  ]);
  
  console.log(`✅ Created ${roles.length} roles\n`);

  // ============================================================================
  // 3. Seed Permissions
  // ============================================================================
  console.log('🔐 Creating Permissions...');
  
  const permissions = await Promise.all([
    // University Management
    prisma.permission.upsert({
      where: { slug: 'university.create' },
      update: {},
      create: { slug: 'university.create', name: 'Create University', resource: 'university', action: 'create' }
    }),
    prisma.permission.upsert({
      where: { slug: 'university.read' },
      update: {},
      create: { slug: 'university.read', name: 'View University', resource: 'university', action: 'read' }
    }),
    prisma.permission.upsert({
      where: { slug: 'university.update' },
      update: {},
      create: { slug: 'university.update', name: 'Update University', resource: 'university', action: 'update' }
    }),
    prisma.permission.upsert({
      where: { slug: 'university.delete' },
      update: {},
      create: { slug: 'university.delete', name: 'Delete University', resource: 'university', action: 'delete' }
    }),
    
    // College Management
    prisma.permission.upsert({
      where: { slug: 'college.create' },
      update: {},
      create: { slug: 'college.create', name: 'Create College', resource: 'college', action: 'create' }
    }),
    prisma.permission.upsert({
      where: { slug: 'college.read' },
      update: {},
      create: { slug: 'college.read', name: 'View College', resource: 'college', action: 'read' }
    }),
    prisma.permission.upsert({
      where: { slug: 'college.update' },
      update: {},
      create: { slug: 'college.update', name: 'Update College', resource: 'college', action: 'update' }
    }),
    prisma.permission.upsert({
      where: { slug: 'college.delete' },
      update: {},
      create: { slug: 'college.delete', name: 'Delete College', resource: 'college', action: 'delete' }
    }),
    
    // User Management
    prisma.permission.upsert({
      where: { slug: 'user.create' },
      update: {},
      create: { slug: 'user.create', name: 'Create User', resource: 'user', action: 'create' }
    }),
    prisma.permission.upsert({
      where: { slug: 'user.read' },
      update: {},
      create: { slug: 'user.read', name: 'View User', resource: 'user', action: 'read' }
    }),
    prisma.permission.upsert({
      where: { slug: 'user.update' },
      update: {},
      create: { slug: 'user.update', name: 'Update User', resource: 'user', action: 'update' }
    }),
    prisma.permission.upsert({
      where: { slug: 'user.delete' },
      update: {},
      create: { slug: 'user.delete', name: 'Delete User', resource: 'user', action: 'delete' }
    }),
    
    // God Mode
    prisma.permission.upsert({
      where: { slug: 'god-mode.access' },
      update: {},
      create: { slug: 'god-mode.access', name: 'God Mode Access', resource: 'platform', action: 'god-mode', description: 'Cross-tenant platform access' }
    })
  ]);
  
  console.log(`✅ Created ${permissions.length} permissions\n`);

  // ============================================================================
  // 4. Assign Permissions to Roles
  // ============================================================================
  console.log('🔗 Assigning Permissions to Roles...');
  
  const bitflowOwnerRole = await prisma.role.findUnique({ where: { slug: 'bitflow-owner' } });
  const godModePermission = await prisma.permission.findUnique({ where: { slug: 'god-mode.access' } });
  
  if (bitflowOwnerRole && godModePermission) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: bitflowOwnerRole.id,
          permissionId: godModePermission.id
        }
      },
      update: {},
      create: {
        roleId: bitflowOwnerRole.id,
        permissionId: godModePermission.id
      }
    });
  }
  
  // Assign all university permissions to Bitflow Owner
  const universityPermissions = permissions.filter(p => p.resource === 'university');
  for (const perm of universityPermissions) {
    if (bitflowOwnerRole) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: bitflowOwnerRole.id,
            permissionId: perm.id
          }
        },
        update: {},
        create: {
          roleId: bitflowOwnerRole.id,
          permissionId: perm.id
        }
      });
    }
  }
  
  console.log('✅ Assigned permissions to roles\n');

  // ============================================================================
  // 5. Seed Users - Platform Level
  // ============================================================================
  console.log('👤 Creating Platform Users...');
  
  const hashedPassword = await bcrypt.hash('Bitflow@2025', 10);
  
  const bitflowOwner = await prisma.user.upsert({
    where: { email: 'owner@bitflow.io' },
    update: {},
    create: {
      universityId: 'PLATFORM',
      username: 'bitflow-owner',
      email: 'owner@bitflow.io',
      passwordHash: hashedPassword,
      firstName: 'Bitflow',
      lastName: 'Owner',
      phone: '+1-555-9999',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BitflowOwner',
      status: 'active',
      emailVerifiedAt: new Date()
    }
  });
  
  const bitflowAdmin1 = await prisma.user.upsert({
    where: { email: 'admin1@bitflow.io' },
    update: {},
    create: {
      universityId: 'PLATFORM',
      username: 'bitflow-admin-1',
      email: 'admin1@bitflow.io',
      passwordHash: hashedPassword,
      firstName: 'Admin',
      lastName: 'One',
      phone: '+1-555-8881',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin1',
      status: 'active',
      emailVerifiedAt: new Date()
    }
  });
  
  const bitflowAdmin2 = await prisma.user.upsert({
    where: { email: 'admin2@bitflow.io' },
    update: {},
    create: {
      universityId: 'PLATFORM',
      username: 'bitflow-admin-2',
      email: 'admin2@bitflow.io',
      passwordHash: hashedPassword,
      firstName: 'Admin',
      lastName: 'Two',
      phone: '+1-555-8882',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin2',
      status: 'active',
      emailVerifiedAt: new Date()
    }
  });
  
  console.log('✅ Created 3 platform users\n');

  // ============================================================================
  // 6. Assign Roles to Users
  // ============================================================================
  console.log('👥 Assigning Roles to Users...');
  
  if (bitflowOwnerRole) {
    await prisma.roleUser.upsert({
      where: {
        userId_roleId: {
          userId: bitflowOwner.id,
          roleId: bitflowOwnerRole.id
        }
      },
      update: {},
      create: {
        userId: bitflowOwner.id,
        roleId: bitflowOwnerRole.id
      }
    });
  }
  
  const bitflowAdminRole = await prisma.role.findUnique({ where: { slug: 'bitflow-admin' } });
  if (bitflowAdminRole) {
    await prisma.roleUser.upsert({
      where: {
        userId_roleId: {
          userId: bitflowAdmin1.id,
          roleId: bitflowAdminRole.id
        }
      },
      update: {},
      create: {
        userId: bitflowAdmin1.id,
        roleId: bitflowAdminRole.id
      }
    });
    
    await prisma.roleUser.upsert({
      where: {
        userId_roleId: {
          userId: bitflowAdmin2.id,
          roleId: bitflowAdminRole.id
        }
      },
      update: {},
      create: {
        userId: bitflowAdmin2.id,
        roleId: bitflowAdminRole.id
      }
    });
  }
  
  console.log('✅ Assigned roles to platform users\n');

  // ============================================================================
  // 7. Seed Demo Data for University 1 (Alpha)
  // ============================================================================
  const alpha = universities[0];
  console.log(`🏫 Seeding demo data for ${alpha.name}...\n`);

  // Create Academic Year
  const academicYear = await prisma.academicYear.upsert({
    where: {
      universityId_name: {
        universityId: alpha.id,
        name: '2024-2025'
      }
    },
    update: {},
    create: {
      universityId: alpha.id,
      name: '2024-2025',
      startDate: new Date('2024-07-01'),
      endDate: new Date('2025-06-30'),
      isCurrent: true,
      status: 'active'
    }
  });

  // Create College
  const college = await prisma.college.upsert({
    where: {
      universityId_code: {
        universityId: alpha.id,
        code: 'CSE'
      }
    },
    update: {},
    create: {
      universityId: alpha.id,
      name: 'College of Science & Engineering',
      code: 'CSE',
      type: 'Engineering',
      email: 'cse@alpha.edu',
      phone: '+1-555-0111',
      address: '100 Engineering Wing, Alpha Campus',
      establishedYear: 1995,
      status: 'active',
      capacity: 500,
      currentEnrollment: 0,
      accreditation: {
        body: 'ABET',
        year: 2020,
        valid_until: 2027
      }
    }
  });

  // Create Department
  const department = await prisma.department.upsert({
    where: {
      collegeId_code: {
        collegeId: college.id,
        code: 'CS'
      }
    },
    update: {},
    create: {
      universityId: alpha.id,
      collegeId: college.id,
      name: 'Computer Science',
      code: 'CS',
      email: 'cs@alpha.edu',
      phone: '+1-555-0112',
      floorLocation: '3rd Floor, Block A',
      status: 'active'
    }
  });

  // Create Course
  const course = await prisma.course.upsert({
    where: {
      departmentId_code: {
        departmentId: department.id,
        code: 'CS101'
      }
    },
    update: {},
    create: {
      universityId: alpha.id,
      collegeId: college.id,
      departmentId: department.id,
      code: 'CS101',
      name: 'Introduction to Programming',
      description: 'Fundamentals of programming using Python',
      credits: 4,
      level: 'Undergraduate',
      semester: 'Fall',
      syllabusUrl: 'https://example.com/syllabi/cs101.pdf',
      status: 'active'
    }
  });

  // Create University Owner for Alpha
  const uniOwner = await prisma.user.upsert({
    where: { email: 'owner@alpha.edu' },
    update: {},
    create: {
      universityId: alpha.id,
      username: 'alpha-owner',
      email: 'owner@alpha.edu',
      passwordHash: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1-555-0100',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JohnDoe',
      status: 'active',
      emailVerifiedAt: new Date()
    }
  });

  const universityOwnerRole = await prisma.role.findUnique({ where: { slug: 'university-owner' } });
  if (universityOwnerRole) {
    await prisma.roleUser.upsert({
      where: {
        userId_roleId: {
          userId: uniOwner.id,
          roleId: universityOwnerRole.id
        }
      },
      update: {},
      create: {
        userId: uniOwner.id,
        roleId: universityOwnerRole.id
      }
    });
  }

  // Create a sample student
  const studentUser = await prisma.user.upsert({
    where: { email: 'student1@alpha.edu' },
    update: {},
    create: {
      universityId: alpha.id,
      username: 'alice-student',
      email: 'student1@alpha.edu',
      passwordHash: hashedPassword,
      firstName: 'Alice',
      lastName: 'Johnson',
      phone: '+1-555-0201',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AliceJohnson',
      status: 'active',
      emailVerifiedAt: new Date()
    }
  });

  const student = await prisma.student.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: {
      userId: studentUser.id,
      universityId: alpha.id,
      collegeId: college.id,
      departmentId: department.id,
      admissionNumber: 'ALF2024001',
      admissionDate: new Date('2024-07-01'),
      course: 'B.Tech Computer Science',
      year: 1,
      section: 'A',
      rollNumber: '1A01',
      bloodGroup: 'O+',
      dateOfBirth: new Date('2006-03-15'),
      gender: 'Female',
      nationality: 'USA',
      emergencyContact: {
        name: 'Mary Johnson',
        relationship: 'Mother',
        phone: '+1-555-0202'
      },
      guardianName: 'Mary Johnson',
      guardianPhone: '+1-555-0202',
      guardianEmail: 'mary.johnson@email.com',
      status: 'active'
    }
  });

  const studentRole = await prisma.role.findUnique({ where: { slug: 'student' } });
  if (studentRole) {
    await prisma.roleUser.upsert({
      where: {
        userId_roleId: {
          userId: studentUser.id,
          roleId: studentRole.id
        }
      },
      update: {},
      create: {
        userId: studentUser.id,
        roleId: studentRole.id
      }
    });
  }

  // Enroll student in course
  await prisma.enrollment.create({
    data: {
      studentId: student.id,
      courseId: course.id,
      academicYearId: academicYear.id,
      status: 'active'
    }
  });

  console.log('✅ Demo data seeded for Alpha University\n');

  // ============================================================================
  // 8. Seed Settings
  // ============================================================================
  console.log('⚙️  Creating Settings...');
  
  await prisma.setting.upsert({
    where: {
      universityId_key: {
        universityId: alpha.id,
        key: 'platform.maintenance_mode'
      }
    },
    update: {},
    create: {
      universityId: alpha.id,
      key: 'platform.maintenance_mode',
      value: false,
      dataType: 'boolean',
      category: 'platform',
      description: 'Enable/disable maintenance mode',
      isPublic: false
    }
  });

  await prisma.setting.upsert({
    where: {
      universityId_key: {
        universityId: alpha.id,
        key: 'fees.late_fee_per_day'
      }
    },
    update: {},
    create: {
      universityId: alpha.id,
      key: 'fees.late_fee_per_day',
      value: 10,
      dataType: 'number',
      category: 'fees',
      description: 'Late fee charged per day',
      isPublic: true
    }
  });

  console.log('✅ Created settings\n');

  console.log('🎉 Seeding completed successfully!\n');
  console.log('📋 Summary:');
  console.log(`   - Universities: ${universities.length}`);
  console.log(`   - Roles: ${roles.length}`);
  console.log(`   - Permissions: ${permissions.length}`);
  console.log(`   - Platform Users: 3 (1 Owner, 2 Admins)`);
  console.log(`   - Demo University: ${alpha.name}`);
  console.log(`   - Demo Student: ${studentUser.email}`);
  console.log('\n🔑 Default Password: Bitflow@2025\n');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

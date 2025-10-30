import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

// Get dashboard analytics based on user role
export const getDashboard = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    // @ts-ignore - user is added by auth middleware
    const user = req.user;
    
    if (!user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated'
      });
      return;
    }
    
    const { id, universityId, isGodMode } = user;
    
    // Bitflow Owner - Platform-wide stats
    if (isGodMode) {
      const [
        totalUniversities,
        activeUniversities,
        totalUsers,
        totalColleges,
        totalStudents,
        universities
      ] = await Promise.all([
        prisma.university.count(),
        prisma.university.count({ where: { status: 'live' } }),
        prisma.user.count(),
        prisma.college.count(),
        prisma.student.count(),
        prisma.university.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            name: true,
            slug: true,
            status: true,
            storageQuotaGb: true,
            storageUsedMb: true,
            createdAt: true
          }
        })
      ]);
      
      res.json({
        success: true,
        data: {
          overview: {
            totalUniversities,
            activeUniversities,
            totalUsers,
            totalColleges,
            totalStudents
          },
          recentUniversities: universities,
          userRole: 'bitflow-owner',
          godMode: true
        }
      });
      return;
    }
    
    // University-level stats
    if (universityId) {
      const university = await prisma.university.findUnique({
        where: { id: universityId }
      });
      
      if (!university) {
        res.status(404).json({
          error: 'University not found'
        });
        return;
      }
      
      const [
        totalColleges,
        totalStudents,
        totalFaculty,
        totalStaff,
        activeEnrollments,
        recentAuditLogs
      ] = await Promise.all([
        prisma.college.count({ where: { universityId } }),
        prisma.student.count({ where: { universityId, status: 'active' } }),
        prisma.faculty.count({ where: { universityId, status: 'active' } }),
        prisma.staff.count({ where: { universityId, status: 'active' } }),
        prisma.enrollment.count({ where: { student: { universityId }, status: 'active' } }),
        prisma.auditLog.findMany({
          where: { universityId },
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            action: true,
            entityType: true,
            createdAt: true
          }
        })
      ]);
      
      const storageUsagePercent = (Number(university.storageUsedMb) / (university.storageQuotaGb * 1024)) * 100;
      
      res.json({
        success: true,
        data: {
          overview: {
            university: {
              name: university.name,
              status: university.status,
              establishedYear: university.establishedYear
            },
            totalColleges,
            totalStudents,
            totalFaculty,
            totalStaff,
            activeEnrollments,
            storage: {
              usedMb: university.storageUsedMb.toString(),
              quotaGb: university.storageQuotaGb,
              usagePercent: Math.round(storageUsagePercent * 100) / 100
            }
          },
          recentActivity: recentAuditLogs,
          userRole: 'university-user'
        }
      });
      return;
    }

    // Default response
    res.json({
      success: true,
      data: {
        overview: {
          message: 'Dashboard data available based on your role'
        },
        userRole: 'user'
      }
    });
    
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch dashboard data'
    });
  }
};

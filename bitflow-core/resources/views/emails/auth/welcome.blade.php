<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to BitFlow Nova LMS</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .content {
            padding: 40px 30px;
        }
        .content h2 {
            color: #333;
            font-size: 24px;
            margin-top: 0;
        }
        .content p {
            color: #666;
            margin: 15px 0;
        }
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        .button {
            display: inline-block;
            padding: 14px 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 16px;
        }
        .credentials-box {
            background: #f8f9fa;
            border: 2px solid #667eea;
            padding: 20px;
            margin: 20px 0;
            border-radius: 6px;
        }
        .credentials-box p {
            margin: 8px 0;
            color: #333;
        }
        .credentials-box strong {
            color: #667eea;
        }
        .features {
            margin: 30px 0;
        }
        .feature-item {
            display: flex;
            align-items: flex-start;
            margin: 15px 0;
        }
        .feature-icon {
            font-size: 24px;
            margin-right: 15px;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px 30px;
            text-align: center;
            border-top: 1px solid #e9ecef;
        }
        .footer p {
            margin: 5px 0;
            color: #999;
            font-size: 13px;
        }
        @media only screen and (max-width: 600px) {
            .container {
                margin: 0;
                border-radius: 0;
            }
            .header, .content, .footer {
                padding: 30px 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎓 Welcome to BitFlow Nova LMS!</h1>
        </div>
        
        <div class="content">
            <h2>Hello {{ $user->first_name ?? 'Student' }}!</h2>
            
            <p>Welcome to <strong>BitFlow Nova Learning Management System</strong>. We're excited to have you on board!</p>
            
            <p>Your account has been successfully created. Here are your login credentials:</p>
            
            <div class="credentials-box">
                <p><strong>Username:</strong> {{ $user->username }}</p>
                <p><strong>Email:</strong> {{ $user->email }}</p>
                <p><strong>Temporary Password:</strong> {{ $temporaryPassword ?? '(Set your own password)' }}</p>
                <p><strong>College:</strong> {{ $college->name ?? 'N/A' }}</p>
            </div>
            
            <div class="button-container">
                <a href="{{ config('app.url') }}/login" class="button">Login Now</a>
            </div>
            
            <div class="features">
                <h3>What you can do:</h3>
                
                <div class="feature-item">
                    <span class="feature-icon">📚</span>
                    <div>
                        <strong>Access Library Resources</strong>
                        <p>Browse notes, videos, and ebooks for your courses</p>
                    </div>
                </div>
                
                <div class="feature-item">
                    <span class="feature-icon">📝</span>
                    <div>
                        <strong>Take Assessments</strong>
                        <p>Complete assignments and exams online</p>
                    </div>
                </div>
                
                <div class="feature-item">
                    <span class="feature-icon">📅</span>
                    <div>
                        <strong>View Timetable</strong>
                        <p>Check your class schedule and upcoming lectures</p>
                    </div>
                </div>
                
                <div class="feature-item">
                    <span class="feature-icon">💰</span>
                    <div>
                        <strong>Manage Fees</strong>
                        <p>View invoices and payment history</p>
                    </div>
                </div>
                
                <div class="feature-item">
                    <span class="feature-icon">📊</span>
                    <div>
                        <strong>Track Attendance</strong>
                        <p>Monitor your attendance across all subjects</p>
                    </div>
                </div>
            </div>
            
            <p><strong>⚠️ Important:</strong> For security reasons, please change your temporary password after your first login.</p>
            
            <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
            
            <p>Happy Learning!<br><strong>The BitFlow Nova Team</strong></p>
        </div>
        
        <div class="footer">
            <p>© {{ date('Y') }} BitFlow Nova LMS. All rights reserved.</p>
            <p>Need help? Contact us at <a href="mailto:support@bitflow.edu" style="color: #667eea;">support@bitflow.edu</a></p>
        </div>
    </div>
</body>
</html>

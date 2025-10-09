<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password</title>
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
            transition: transform 0.2s;
        }
        .button:hover {
            transform: translateY(-2px);
        }
        .info-box {
            background: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .info-box p {
            margin: 0;
            color: #555;
            font-size: 14px;
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
        .link {
            color: #667eea;
            text-decoration: none;
            word-break: break-all;
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
            <h1>🔐 BitFlow Nova LMS</h1>
        </div>
        
        <div class="content">
            <h2>Reset Your Password</h2>
            
            <p>Hello {{ $user->first_name ?? 'User' }},</p>
            
            <p>We received a request to reset your password for your BitFlow Nova LMS account. If you didn't make this request, you can safely ignore this email.</p>
            
            <div class="button-container">
                <a href="{{ $resetUrl }}" class="button">Reset Password</a>
            </div>
            
            <div class="info-box">
                <p><strong>⏰ This link will expire in {{ config('auth.passwords.users.expire') }} minutes</strong></p>
            </div>
            
            <p>If the button above doesn't work, copy and paste this link into your browser:</p>
            <p><a href="{{ $resetUrl }}" class="link">{{ $resetUrl }}</a></p>
            
            <p>For security reasons:</p>
            <ul>
                <li>This reset link can only be used once</li>
                <li>Never share this link with anyone</li>
                <li>If you didn't request this reset, please contact support immediately</li>
            </ul>
            
            <p>Best regards,<br><strong>The BitFlow Nova Team</strong></p>
        </div>
        
        <div class="footer">
            <p>© {{ date('Y') }} BitFlow Nova LMS. All rights reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
            <p>Need help? Contact us at <a href="mailto:support@bitflow.edu" class="link">support@bitflow.edu</a></p>
        </div>
    </div>
</body>
</html>

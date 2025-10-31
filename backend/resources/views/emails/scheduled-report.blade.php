<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Scheduled Report</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 14px;
        }
        .content {
            padding: 30px;
        }
        .message {
            background-color: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .details {
            margin: 20px 0;
        }
        .details table {
            width: 100%;
            border-collapse: collapse;
        }
        .details td {
            padding: 10px 0;
            border-bottom: 1px solid #e9ecef;
        }
        .details td:first-child {
            font-weight: 600;
            color: #495057;
            width: 40%;
        }
        .details td:last-child {
            color: #6c757d;
        }
        .attachment-notice {
            background-color: #e7f3ff;
            border: 1px solid #b3d9ff;
            border-radius: 4px;
            padding: 15px;
            margin: 20px 0;
            display: flex;
            align-items: center;
        }
        .attachment-notice::before {
            content: "📎";
            font-size: 24px;
            margin-right: 15px;
        }
        .attachment-notice p {
            margin: 0;
            color: #004085;
            font-size: 14px;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px 30px;
            text-align: center;
            color: #6c757d;
            font-size: 12px;
        }
        .footer p {
            margin: 5px 0;
        }
        .footer a {
            color: #667eea;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Scheduled Report</h1>
            <p>{{ $scheduleName }}</p>
        </div>
        
        <div class="content">
            <p>Hello,</p>
            
            <div class="message">
                <p>{{ $message }}</p>
            </div>
            
            <div class="details">
                <table>
                    <tr>
                        <td>Report Name</td>
                        <td>{{ $scheduleName }}</td>
                    </tr>
                    @if($scheduleDescription)
                    <tr>
                        <td>Description</td>
                        <td>{{ $scheduleDescription }}</td>
                    </tr>
                    @endif
                    <tr>
                        <td>Report Type</td>
                        <td>{{ ucfirst($reportType) }} Report</td>
                    </tr>
                    <tr>
                        <td>Generated At</td>
                        <td>{{ $generatedAt }}</td>
                    </tr>
                </table>
            </div>
            
            <div class="attachment-notice">
                <p><strong>The PDF report is attached to this email.</strong><br>
                Please download the attachment to view the complete report.</p>
            </div>
            
            <p style="margin-top: 30px; color: #6c757d; font-size: 14px;">
                This is an automated email from your scheduled report. If you no longer wish to receive this report, please update your schedule settings in the BitFlow Admin Portal.
            </p>
        </div>
        
        <div class="footer">
            <p><strong>BitFlow Admin Portal</strong></p>
            <p>Automated Reporting System</p>
            <p style="margin-top: 10px;">
                <a href="{{ config('app.url') }}">Visit Portal</a> | 
                <a href="mailto:support@bitflow.com">Contact Support</a>
            </p>
        </div>
    </div>
</body>
</html>

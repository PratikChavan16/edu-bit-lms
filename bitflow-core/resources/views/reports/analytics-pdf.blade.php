<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Analytics Report - {{ ucfirst(str_replace('_', ' ', $report_type)) }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            font-size: 12px;
            color: #333;
            line-height: 1.6;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            margin-bottom: 30px;
        }
        .header h1 {
            font-size: 24px;
            margin-bottom: 10px;
        }
        .header .meta {
            font-size: 11px;
            opacity: 0.9;
        }
        .container {
            padding: 0 30px 30px;
        }
        .section {
            margin-bottom: 25px;
        }
        .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #667eea;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-bottom: 20px;
        }
        .stat-card {
            background: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 15px;
            border-radius: 4px;
        }
        .stat-label {
            font-size: 11px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .stat-value {
            font-size: 20px;
            font-weight: bold;
            color: #333;
            margin-top: 5px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        thead {
            background: #667eea;
            color: white;
        }
        th, td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
        }
        th {
            font-weight: 600;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        tbody tr:nth-child(even) {
            background: #f8f9fa;
        }
        tbody tr:hover {
            background: #e2e8f0;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            font-size: 10px;
            color: #666;
        }
        .badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: 600;
        }
        .badge-success {
            background: #d4edda;
            color: #155724;
        }
        .badge-warning {
            background: #fff3cd;
            color: #856404;
        }
        .badge-danger {
            background: #f8d7da;
            color: #721c24;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Analytics Report</h1>
        <div class="meta">
            <strong>{{ ucfirst(str_replace('_', ' ', $report_type)) }}</strong> | 
            Generated on {{ $generated_at->format('F d, Y h:i A') }}
        </div>
    </div>

    <div class="container">
        @if($report_type === 'dashboard')
            @include('reports.partials.dashboard-pdf', ['data' => $data])
        @elseif($report_type === 'student_performance')
            @include('reports.partials.student-performance-pdf', ['data' => $data])
        @elseif($report_type === 'attendance')
            @include('reports.partials.attendance-pdf', ['data' => $data])
        @elseif($report_type === 'fee_collection')
            @include('reports.partials.fee-collection-pdf', ['data' => $data])
        @elseif($report_type === 'library')
            @include('reports.partials.library-pdf', ['data' => $data])
        @elseif($report_type === 'assessments')
            @include('reports.partials.assessments-pdf', ['data' => $data])
        @endif

        <div class="footer">
            <p>This is a system-generated report from EduBit LMS</p>
            <p>© {{ date('Y') }} EduBit. All rights reserved.</p>
        </div>
    </div>
</body>
</html>

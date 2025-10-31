<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Users Report</title>
    <style>
        @page {
            margin: 2cm 1.5cm;
        }
        
        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            font-size: 10pt;
            color: #333;
            line-height: 1.4;
        }
        
        .header {
            text-align: center;
            border-bottom: 3px solid #059669;
            padding-bottom: 15px;
            margin-bottom: 25px;
        }
        
        .header h1 {
            margin: 0 0 5px 0;
            color: #047857;
            font-size: 24pt;
            font-weight: bold;
        }
        
        .header .subtitle {
            color: #6b7280;
            font-size: 10pt;
            margin: 5px 0;
        }
        
        .metadata {
            background: #f3f4f6;
            padding: 12px;
            border-radius: 5px;
            margin-bottom: 20px;
            font-size: 9pt;
        }
        
        .metadata-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
        }
        
        .metadata-label {
            font-weight: bold;
            color: #4b5563;
        }
        
        .summary-cards {
            display: flex;
            justify-content: space-between;
            margin-bottom: 25px;
            gap: 10px;
        }
        
        .summary-card {
            flex: 1;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
        }
        
        .summary-card.success {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }
        
        .summary-card.warning {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }
        
        .summary-card .label {
            font-size: 9pt;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            opacity: 0.9;
            margin-bottom: 5px;
        }
        
        .summary-card .value {
            font-size: 24pt;
            font-weight: bold;
        }
        
        .section-title {
            color: #047857;
            font-size: 14pt;
            font-weight: bold;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 8px;
            margin: 25px 0 15px 0;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 9pt;
        }
        
        thead {
            background: #047857;
            color: white;
        }
        
        th {
            padding: 10px 8px;
            text-align: left;
            font-weight: bold;
            font-size: 9pt;
        }
        
        td {
            padding: 8px;
            border-bottom: 1px solid #e5e7eb;
        }
        
        tbody tr:nth-child(even) {
            background: #f9fafb;
        }
        
        .badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 8pt;
            font-weight: bold;
            text-transform: uppercase;
        }
        
        .badge-success {
            background: #d1fae5;
            color: #065f46;
        }
        
        .badge-warning {
            background: #fed7aa;
            color: #92400e;
        }
        
        .badge-primary {
            background: #dbeafe;
            color: #1e40af;
        }
        
        .badge-purple {
            background: #e9d5ff;
            color: #6b21a8;
        }
        
        .badge-pink {
            background: #fce7f3;
            color: #9f1239;
        }
        
        .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 8pt;
            color: #9ca3af;
            padding: 10px 0;
            border-top: 1px solid #e5e7eb;
        }
        
        .page-number:before {
            content: "Page " counter(page) " of " counter(pages);
        }
        
        .no-data {
            text-align: center;
            padding: 40px;
            color: #9ca3af;
            font-style: italic;
        }
        
        .role-breakdown {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin: 15px 0;
        }
        
        .role-item {
            background: #f3f4f6;
            padding: 8px 12px;
            border-radius: 5px;
            border-left: 3px solid #10b981;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $title }}</h1>
        <div class="subtitle">Comprehensive Users Report</div>
    </div>
    
    <div class="metadata">
        <div class="metadata-row">
            <span><span class="metadata-label">Generated:</span> {{ $generated_at }}</span>
            <span><span class="metadata-label">By:</span> {{ $generated_by }}</span>
        </div>
        <div class="metadata-row">
            <span><span class="metadata-label">Total Users:</span> {{ $total_count }}</span>
            <span><span class="metadata-label">Report Type:</span> Users</span>
        </div>
    </div>
    
    <div class="summary-cards">
        <div class="summary-card">
            <div class="label">Total</div>
            <div class="value">{{ $total_count }}</div>
        </div>
        <div class="summary-card success">
            <div class="label">Active</div>
            <div class="value">{{ $summary['active'] }}</div>
        </div>
        <div class="summary-card warning">
            <div class="label">Inactive</div>
            <div class="value">{{ $summary['inactive'] }}</div>
        </div>
    </div>
    
    @if(!empty($summary['by_role']))
        <h2 class="section-title">Distribution by Role</h2>
        <div class="role-breakdown">
            @foreach($summary['by_role'] as $role => $count)
                <div class="role-item">
                    <strong>{{ ucwords(str_replace('_', ' ', $role)) }}:</strong> {{ $count }}
                </div>
            @endforeach
        </div>
    @endif
    
    <h2 class="section-title">Users List</h2>
    
    @if($users->count() > 0)
        <table>
            <thead>
                <tr>
                    <th style="width: 5%">#</th>
                    <th style="width: 25%">Name</th>
                    <th style="width: 25%">Email</th>
                    <th style="width: 20%">Role</th>
                    <th style="width: 15%">Joined</th>
                    <th style="width: 10%">Status</th>
                </tr>
            </thead>
            <tbody>
                @foreach($users as $index => $user)
                    <tr>
                        <td>{{ $index + 1 }}</td>
                        <td><strong>{{ $user->name }}</strong></td>
                        <td>{{ $user->email }}</td>
                        <td>
                            @foreach($user->roles as $role)
                                @if($role->name === 'super_admin')
                                    <span class="badge badge-primary">{{ ucwords(str_replace('_', ' ', $role->name)) }}</span>
                                @elseif($role->name === 'university_owner')
                                    <span class="badge badge-purple">{{ ucwords(str_replace('_', ' ', $role->name)) }}</span>
                                @elseif($role->name === 'college_admin')
                                    <span class="badge badge-pink">{{ ucwords(str_replace('_', ' ', $role->name)) }}</span>
                                @else
                                    <span class="badge badge-success">{{ ucwords(str_replace('_', ' ', $role->name)) }}</span>
                                @endif
                            @endforeach
                        </td>
                        <td>{{ $user->created_at ? $user->created_at->format('M d, Y') : 'N/A' }}</td>
                        <td>
                            @if($user->status === 'active')
                                <span class="badge badge-success">Active</span>
                            @else
                                <span class="badge badge-warning">Inactive</span>
                            @endif
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
        
        <div style="margin-top: 30px; padding: 15px; background: #f9fafb; border-left: 4px solid #059669;">
            <strong>Summary Statistics:</strong><br>
            Total Users: <strong>{{ $total_count }}</strong><br>
            Active Rate: <strong>{{ $total_count > 0 ? round(($summary['active'] / $total_count) * 100, 1) : 0 }}%</strong><br>
            Unique Roles: <strong>{{ count($summary['by_role'] ?? []) }}</strong>
        </div>
    @else
        <div class="no-data">
            No users found matching the specified criteria.
        </div>
    @endif
    
    @if(!empty($filters_applied) && count($filters_applied) > 0)
        <h2 class="section-title" style="page-break-before: avoid;">Applied Filters</h2>
        <div style="background: #fffbeb; padding: 12px; border-radius: 5px; border-left: 4px solid #f59e0b;">
            @foreach($filters_applied as $key => $value)
                <div style="margin-bottom: 5px;">
                    <strong>{{ ucfirst(str_replace('_', ' ', $key)) }}:</strong>
                    @if(is_array($value))
                        @if(array_keys($value) === range(0, count($value) - 1))
                            {{ implode(', ', $value) }}
                        @else
                            @foreach($value as $subKey => $subValue)
                                {{ ucfirst($subKey) }}: {{ $subValue }}{{ !$loop->last ? ', ' : '' }}
                            @endforeach
                        @endif
                    @else
                        {{ $value }}
                    @endif
                </div>
            @endforeach
        </div>
    @endif
    
    <div class="footer">
        <div class="page-number"></div>
        <div>BitFlow Admin Portal - Confidential Report</div>
    </div>
</body>
</html>

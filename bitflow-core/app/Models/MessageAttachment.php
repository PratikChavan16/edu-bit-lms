<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MessageAttachment extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'message_id',
        'file_name',
        'file_path',
        'file_type',
        'mime_type',
        'file_size',
    ];

    protected $casts = [
        'file_size' => 'integer',
    ];

    /**
     * Get the message
     */
    public function message()
    {
        return $this->belongsTo(Message::class);
    }

    /**
     * Get the file URL
     */
    public function getUrlAttribute()
    {
        return url('storage/' . $this->file_path);
    }

    /**
     * Get formatted file size
     */
    public function getFormattedSizeAttribute()
    {
        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];
        
        for ($i = 0; $bytes > 1024; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, 2) . ' ' . $units[$i];
    }

    /**
     * Scope for images
     */
    public function scopeImages($query)
    {
        return $query->where('file_type', 'image');
    }

    /**
     * Scope for documents
     */
    public function scopeDocuments($query)
    {
        return $query->where('file_type', 'document');
    }

    /**
     * Scope for videos
     */
    public function scopeVideos($query)
    {
        return $query->where('file_type', 'video');
    }

    /**
     * Scope for audio files
     */
    public function scopeAudio($query)
    {
        return $query->where('file_type', 'audio');
    }
}

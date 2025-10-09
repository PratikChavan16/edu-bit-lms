<?php

namespace App\Jobs;

use App\Models\Document;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class ProcessDocumentUpload implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public string $documentId,
        public string $tempFilePath
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $document = Document::find($this->documentId);

        if (!$document) {
            \Log::error("Document not found: {$this->documentId}");
            return;
        }

        try {
            // Move from temp to permanent storage
            $fileName = basename($this->tempFilePath);
            $destinationPath = "documents/{$document->folder_id}/{$fileName}";
            
            // Copy to S3 or configured storage
            Storage::disk('s3')->put($destinationPath, Storage::disk('local')->get($this->tempFilePath));
            
            // Update document with permanent URL
            $document->update([
                'file_path' => $destinationPath,
                'file_url' => Storage::disk('s3')->url($destinationPath),
            ]);

            // Clean up temp file
            Storage::disk('local')->delete($this->tempFilePath);

            \Log::info("Document processed successfully: {$this->documentId}");
        } catch (\Exception $e) {
            \Log::error("Failed to process document {$this->documentId}: " . $e->getMessage());
            $this->fail($e);
        }
    }
}

'use client';

import { useState } from 'react';
import { useLearnerDocumentFolders, useLearnerDocuments, useUploadLearnerDocument } from '@bitflow/api-client/learner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitflow/ui/card";
import { Button } from "@bitflow/ui/button";
import { Badge } from "@bitflow/ui/badge";
import { FileUpload } from "@bitflow/ui/file-upload";
import { Modal } from "@bitflow/ui/modal";
import { AlertCircle, Folder, Upload, FileText, Loader2 } from 'lucide-react';

export default function DocumentsPage() {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const { data: foldersData, isLoading: foldersLoading, error: foldersError } = useLearnerDocumentFolders();
  const { data: documentsData, isLoading: documentsLoading } = useLearnerDocuments();
  const uploadMutation = useUploadLearnerDocument({
    onSuccess: () => {
      setUploadModalOpen(false);
      setUploadFile(null);
      setSelectedFolderId(null);
    },
  });

  const folders = foldersData?.data || [];
  const documents = documentsData?.data || [];

  const handleUpload = () => {
    if (uploadFile && selectedFolderId) {
      uploadMutation.mutate({
        folderId: selectedFolderId,
        file: uploadFile,
      });
    }
  };

  if (foldersLoading) {
    return (
      <div className="space-y-6">
        <div className="h-32 animate-pulse rounded-lg bg-muted" />
        <div className="grid gap-4 lg:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (foldersError) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
          <h2 className="mt-4 text-lg font-semibold">Failed to load documents</h2>
          <p className="mt-2 text-sm text-muted-foreground">{foldersError.message}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }
  // Calculate pending uploads (folders with pending_count > 0)
  const pendingFolders = folders.filter((f) => (f.pending_count || 0) > 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Documents</h1>
          <p className="text-muted-foreground">
            Manage uploads requested by admins and keep your personal records • {folders.length} folders
          </p>
        </div>
        <Button onClick={() => setUploadModalOpen(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Upload document
        </Button>
      </div>

      {/* Folders Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {folders.map((folder) => {
          const folderDocs = documents.filter((d) => d.folder_id === folder.id);
          const totalSize = folderDocs.reduce((sum, d) => sum + (d.file_size || 0), 0);
          const storageMB = (totalSize / (1024 * 1024)).toFixed(1);
          const quotaMB = ((folder.storage_quota || 1073741824) / (1024 * 1024)).toFixed(0); // Default 1GB
          const pendingCount = folder.pending_count || 0;

          return (
            <Card key={folder.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Folder className="h-8 w-8 text-primary" />
                    <div>
                      <CardTitle>{folder.name}</CardTitle>
                      <CardDescription>{folder.type}</CardDescription>
                    </div>
                  </div>
                  {pendingCount > 0 && (
                    <Badge variant="warning">{pendingCount} pending</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Storage:</span>
                  <span className="font-medium">{storageMB} MB / {quotaMB} MB</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Documents:</span>
                  <span className="font-medium">{folderDocs.length}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => {
                    setSelectedFolderId(folder.id);
                    setUploadModalOpen(true);
                  }}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload to this folder
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pending Uploads Card */}
      {pendingFolders.length > 0 && (
        <Card className="border-l-4 border-l-warning">
          <CardHeader>
            <CardTitle>Pending uploads</CardTitle>
            <CardDescription>Complete these to avoid escalations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingFolders.map((folder) => (
              <div
                key={folder.id}
                className="rounded-xl border border-border bg-surface px-4 py-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium">{folder.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {folder.pending_count} document(s) pending
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedFolderId(folder.id);
                    setUploadModalOpen(true);
                  }}
                >
                  Upload now
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recent Documents */}
      {documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent documents</CardTitle>
            <CardDescription>Your recently uploaded files</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {documents.slice(0, 5).map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {((doc.file_size || 0) / 1024).toFixed(1)} KB • {new Date(doc.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {doc.status && (
                  <Badge
                    variant={
                      doc.status === 'approved'
                        ? 'success'
                        : doc.status === 'rejected'
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {doc.status}
                  </Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => {
          setUploadModalOpen(false);
          setUploadFile(null);
          setSelectedFolderId(null);
        }}
        title="Upload document"
        description="Select a file to upload to your document folder"
      >
        <div className="space-y-4">
          {!selectedFolderId && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Select folder</label>
              <select
                className="w-full px-3 py-2 border rounded-lg"
                onChange={(e) => setSelectedFolderId(e.target.value)}
              >
                <option value="">Choose a folder...</option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <FileUpload
            onFileSelect={(file) => setUploadFile(file)}
            maxSize={10 * 1024 * 1024} // 10MB
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setUploadModalOpen(false);
                setUploadFile(null);
                setSelectedFolderId(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!uploadFile || !selectedFolderId || uploadMutation.isPending}
            >
              {uploadMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Upload
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

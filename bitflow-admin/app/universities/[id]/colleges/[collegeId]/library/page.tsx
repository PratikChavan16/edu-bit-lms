'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useUniversity } from '@/contexts/UniversityContext';
import { useCollege } from '@/contexts/CollegeContext';
import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { Select, SelectOption } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search, Edit, Trash2, BookOpen } from 'lucide-react';

interface LibraryBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  publication_year: number;
  edition: string;
  resource_type: string;
  category: string;
  total_copies: number;
  available_copies: number;
  issued_copies: number;
  price: number;
  shelf_location: string;
  status: string;
}

interface PaginationMetadata {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

const resourceTypeOptions: SelectOption[] = [
  { label: 'Book', value: 'book' },
  { label: 'Journal', value: 'journal' },
  { label: 'Magazine', value: 'magazine' },
  { label: 'Newspaper', value: 'newspaper' },
  { label: 'E-Book', value: 'ebook' },
  { label: 'Reference', value: 'reference' },
];

const categoryOptions: SelectOption[] = [
  { label: 'Computer Science', value: 'computer_science' },
  { label: 'Engineering', value: 'engineering' },
  { label: 'Mathematics', value: 'mathematics' },
  { label: 'Physics', value: 'physics' },
  { label: 'Chemistry', value: 'chemistry' },
  { label: 'Literature', value: 'literature' },
  { label: 'History', value: 'history' },
  { label: 'General', value: 'general' },
];

const statusOptions: SelectOption[] = [
  { label: 'Available', value: 'available' },
  { label: 'Issued', value: 'issued' },
  { label: 'Reserved', value: 'reserved' },
  { label: 'Damaged', value: 'damaged' },
  { label: 'Lost', value: 'lost' },
];

const filterResourceTypeOptions: SelectOption[] = [
  { label: 'All Types', value: 'all' },
  ...resourceTypeOptions,
];

const filterStatusOptions: SelectOption[] = [
  { label: 'All Statuses', value: 'all' },
  ...statusOptions,
];

export default function LibraryPage() {
  const params = useParams();
  const { university } = useUniversity();
  const { college } = useCollege();

  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<LibraryBook | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [resourceTypeFilter, setResourceTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState<PaginationMetadata>({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  });

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    publication_year: new Date().getFullYear(),
    edition: '',
    resource_type: 'book',
    category: 'general',
    total_copies: 1,
    price: 0,
    shelf_location: '',
    description: '',
    status: 'available',
  });

  useEffect(() => {
    if (university && college) {
      fetchBooks();
    }
  }, [university, college, searchQuery, resourceTypeFilter, statusFilter, pagination.current_page]);

  const fetchBooks = async () => {
    if (!university || !college) return;

    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: pagination.current_page.toString(),
        per_page: pagination.per_page.toString(),
      });

      if (searchQuery) queryParams.append('search', searchQuery);
      if (resourceTypeFilter !== 'all') queryParams.append('resource_type', resourceTypeFilter);
      if (statusFilter !== 'all') queryParams.append('status', statusFilter);

      const data = await apiClient.get<ApiResponse<LibraryBook[]>>(
        `/admin/universities/${university.id}/colleges/${college.id}/library?${queryParams}`
      );

      if (data.success) {
        setBooks(data.data);
        if (data.meta) {
          setPagination({
            current_page: data.meta.current_page,
            last_page: data.meta.last_page,
            per_page: data.meta.per_page,
            total: data.meta.total,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!university || !college) return;

    try {
      const url = editingBook
        ? `/admin/universities/${university.id}/colleges/${college.id}/library/${editingBook.id}`
        : `/admin/universities/${university.id}/colleges/${college.id}/library`;

      const data = editingBook
        ? await apiClient.put<ApiResponse<LibraryBook>>(url, formData)
        : await apiClient.post<ApiResponse<LibraryBook>>(url, formData);

      if (data.success) {
        setIsModalOpen(false);
        resetForm();
        fetchBooks();
      }
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  const handleDelete = async (bookId: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return;
    if (!university || !college) return;

    try {
      const data = await apiClient.delete<ApiResponse<void>>(
        `/admin/universities/${university.id}/colleges/${college.id}/library/${bookId}`
      );

      if (data.success) {
        fetchBooks();
      }
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      isbn: '',
      publisher: '',
      publication_year: new Date().getFullYear(),
      edition: '',
      resource_type: 'book',
      category: 'general',
      total_copies: 1,
      price: 0,
      shelf_location: '',
      description: '',
      status: 'available',
    });
    setEditingBook(null);
  };

  const openEditModal = (book: LibraryBook) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      publisher: book.publisher,
      publication_year: book.publication_year,
      edition: book.edition,
      resource_type: book.resource_type,
      category: book.category,
      total_copies: book.total_copies,
      price: book.price,
      shelf_location: book.shelf_location,
      description: '',
      status: book.status,
    });
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const getStatusVariant = (status: string): 'default' | 'success' | 'warning' | 'danger' => {
    switch (status) {
      case 'available':
        return 'success';
      case 'issued':
        return 'warning';
      case 'damaged':
      case 'lost':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getResourceTypeLabel = (type: string) => {
    const option = resourceTypeOptions.find((opt) => opt.value === type);
    return option?.label || type;
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {university && college && (
        <Alert variant="warning">
          <AlertDescription>
            <strong>God Mode Active:</strong> Managing library for{' '}
            <strong>{college.name}</strong> at <strong>{university.name}</strong>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Library Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage books, journals, and library resources
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          Add Book
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by title, author, ISBN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          options={filterResourceTypeOptions}
          value={resourceTypeFilter}
          onChange={setResourceTypeFilter}
          className="w-[180px]"
        />
        <Select
          options={filterStatusOptions}
          value={statusFilter}
          onChange={setStatusFilter}
          className="w-[180px]"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>ISBN</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Copies</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : books.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-gray-500">No books found</p>
                </TableCell>
              </TableRow>
            ) : (
              books.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="font-medium">{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell className="text-sm font-mono">{book.isbn}</TableCell>
                  <TableCell>
                    <Badge variant="info">{getResourceTypeLabel(book.resource_type)}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{book.available_copies}/{book.total_copies}</div>
                      <div className="text-gray-500">available</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(book.status)}>{book.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(book)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(book.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination.last_page > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {(pagination.current_page - 1) * pagination.per_page + 1} to{' '}
            {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of{' '}
            {pagination.total} books
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagination({
                  ...pagination,
                  current_page: pagination.current_page - 1,
                })
              }
              disabled={pagination.current_page === 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {pagination.current_page} of {pagination.last_page}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagination({
                  ...pagination,
                  current_page: pagination.current_page + 1,
                })
              }
              disabled={pagination.current_page === pagination.last_page}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBook ? 'Edit Book' : 'Add New Book'}
        description={
          editingBook ? 'Update book details below' : 'Fill in the book information below'
        }
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="isbn">ISBN *</Label>
              <Input
                id="isbn"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                placeholder="978-3-16-148410-0"
                required
              />
            </div>
            <div>
              <Label htmlFor="publisher">Publisher</Label>
              <Input
                id="publisher"
                value={formData.publisher}
                onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="publication_year">Publication Year *</Label>
              <Input
                id="publication_year"
                type="number"
                value={formData.publication_year}
                onChange={(e) =>
                  setFormData({ ...formData, publication_year: parseInt(e.target.value) })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="edition">Edition</Label>
              <Input
                id="edition"
                value={formData.edition}
                onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                placeholder="1st, 2nd, 3rd..."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Resource Type *"
              options={resourceTypeOptions}
              value={formData.resource_type}
              onChange={(value) => setFormData({ ...formData, resource_type: value })}
            />
            <Select
              label="Category *"
              options={categoryOptions}
              value={formData.category}
              onChange={(value) => setFormData({ ...formData, category: value })}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="total_copies">Total Copies *</Label>
              <Input
                id="total_copies"
                type="number"
                min="1"
                value={formData.total_copies}
                onChange={(e) =>
                  setFormData({ ...formData, total_copies: parseInt(e.target.value) })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="price">Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: parseFloat(e.target.value) })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="shelf_location">Shelf Location</Label>
              <Input
                id="shelf_location"
                value={formData.shelf_location}
                onChange={(e) => setFormData({ ...formData, shelf_location: e.target.value })}
                placeholder="A-12-3"
              />
            </div>
          </div>

          <Select
            label="Status *"
            options={statusOptions}
            value={formData.status}
            onChange={(value) => setFormData({ ...formData, status: value })}
          />

          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{editingBook ? 'Update Book' : 'Add Book'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('library_books', function (Blueprint $table) {
            $table->id();
            $table->foreignId('university_id')->constrained('universities')->onDelete('cascade');
            $table->foreignId('college_id')->constrained('colleges')->onDelete('cascade');
            $table->foreignId('department_id')->nullable()->constrained('departments')->onDelete('set null');
            
            $table->string('title');
            $table->string('author');
            $table->string('isbn', 20)->unique()->nullable();
            $table->string('publisher')->nullable();
            $table->integer('publication_year')->nullable();
            $table->string('edition')->nullable();
            
            $table->enum('resource_type', ['book', 'journal', 'magazine', 'ebook', 'reference', 'thesis'])->default('book');
            $table->string('category')->nullable();
            $table->string('language')->default('English');
            
            $table->integer('total_copies')->default(1);
            $table->integer('available_copies')->default(1);
            $table->integer('issued_copies')->default(0);
            
            $table->decimal('price', 10, 2)->nullable();
            $table->date('purchase_date')->nullable();
            $table->string('shelf_location')->nullable();
            
            $table->text('description')->nullable();
            $table->string('cover_image_url')->nullable();
            
            $table->enum('status', ['available', 'issued', 'damaged', 'lost', 'maintenance'])->default('available');
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['college_id', 'resource_type']);
            $table->index(['isbn']);
            // Fulltext index only for MySQL/PostgreSQL - not supported in SQLite
            if (DB::getDriverName() !== 'sqlite') {
                $table->fullText(['title', 'author']);
            }
        });

        Schema::create('library_issues', function (Blueprint $table) {
            $table->id();
            $table->foreignId('library_book_id')->constrained('library_books')->onDelete('cascade');
            $table->foreignId('student_id')->nullable()->constrained('students')->onDelete('set null');
            $table->foreignId('faculty_id')->nullable()->constrained('faculty')->onDelete('set null');
            
            $table->string('issue_number')->unique();
            $table->date('issue_date');
            $table->date('due_date');
            $table->date('return_date')->nullable();
            
            $table->enum('status', ['issued', 'returned', 'overdue', 'lost'])->default('issued');
            $table->integer('overdue_days')->default(0);
            $table->decimal('fine_amount', 10, 2)->default(0);
            $table->boolean('fine_paid')->default(false);
            
            $table->text('issue_remarks')->nullable();
            $table->text('return_remarks')->nullable();
            
            $table->timestamps();
            
            $table->index(['status', 'due_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('library_issues');
        Schema::dropIfExists('library_books');
    }
};

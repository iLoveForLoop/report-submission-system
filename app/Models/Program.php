<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Program extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'coordinator_id',
    ];

    // ────────────────────────────────────────────────
    // RELATIONSHIPS
    // ────────────────────────────────────────────────

    public function coordinator()
    {
        return $this->belongsTo(User::class, 'coordinator_id');
    }

    public function reports()
    {
        return $this->hasMany(Report::class);
    }

    public function hasPendingReportsForUser(int $userId): bool
    {
        return $this->reports()
            ->where(function ($query) use ($userId) {
                $query->whereDoesntHave('submissions', function ($q) use ($userId) {
                    $q->where('field_officer_id', $userId);
                })
                ->orWhereHas('submissions', function ($q) use ($userId) {
                    $q->where('field_officer_id', $userId)
                    ->where('status', 'returned');
                });
            })
            ->exists();
    }

    // All submissions across all reports in this program
    public function reportSubmissions(): HasManyThrough
    {
        return $this->hasManyThrough(
            ReportSubmission::class,
            Report::class,
            'program_id',  // FK on reports table
            'report_id',   // FK on report_submissions table
        );
    }

    // Convenience: only submitted ones (awaiting focal person review)
    public function pendingSubmissions(): HasManyThrough
    {
        return $this->hasManyThrough(
            ReportSubmission::class,
            Report::class,
            'program_id',
            'report_id',
        )->where('report_submissions.status', 'submitted');
    }


}

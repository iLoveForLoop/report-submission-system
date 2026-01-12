<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Report extends Model implements HasMedia
{

    use InteractsWithMedia, HasFactory;
    public $incrementing = false;
    protected $keyType = 'string';

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (! $model->id) {
                $model->id = Str::uuid()->toString();
            }
        });
    }

    protected $fillable = [
        'title',
        'description',
        'program_id',
        'created_by',
        'deadline',
        'final_deadline',
        'form_schema'
    ];

    protected $casts = [
        'form_schema' => 'array',
        'deadline' => 'date',
        'final_deadline' => 'date',
    ];

    // ────────────────────────────────────────────────
    // RELATIONSHIPS
    // ────────────────────────────────────────────────

    public function program()
    {
        return $this->belongsTo(Program::class);
    }

    public function coordinator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }


    public function fields()
    {
        return $this->hasMany(ReportField::class);
    }

    public function assignments()
    {
        return $this->hasMany(ReportAssignment::class);
    }

    public function submissions()
    {
        return $this->hasMany(ReportSubmission::class);
    }

    public function hasSubmissionFromUser(int $userId): bool
    {
        return $this->submissions()
            ->where('field_officer_id', $userId)
            ->exists();
    }
}

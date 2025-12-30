<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Report extends Model
{
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
}

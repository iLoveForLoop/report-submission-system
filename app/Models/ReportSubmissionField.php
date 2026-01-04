<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ReportSubmissionField extends Model
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
        'submission_id',
        'report_field_id',
        'value',
    ];

    public function submission()
    {
        return $this->belongsTo(ReportSubmission::class, 'submission_id');
    }

    public function reportField()
    {
        return $this->belongsTo(ReportField::class, 'report_field_id');
    }
}
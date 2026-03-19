<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class ReportSubmission extends Model implements HasMedia
{
    use InteractsWithMedia, HasFactory, LogsActivity;
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
        'report_id',
        'field_officer_id',
        'status',
        'timeliness',
        'remarls',
        'description',
        'data',
        'remarks',
    ];

    protected $casts = [
        'data' => 'array',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['data', 'description'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->setDescriptionForEvent(fn(string $eventName) => match($eventName) {
                'updated' => 'Submission was updated',
                'created' => 'Submission was created',
                default   => "Submission was {$eventName}",
            });
    }

    public function report()
    {
        return $this->belongsTo(Report::class);
    }

    public function fieldOfficer()
    {
        return $this->belongsTo(User::class, 'field_officer_id');
    }

    public function fields()
    {
        return $this->hasMany(ReportSubmissionField::class, 'submission_id');
    }
}

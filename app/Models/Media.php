<?php

namespace App\Models;

use Spatie\MediaLibrary\MediaCollections\Models\Media as BaseMedia;

class Media extends BaseMedia
{
    // Include 'url' in JSON automatically
    protected $appends = ['url'];

    public function getUrlAttribute()
    {
        return $this->getUrl(); // Spatie method generates the URL dynamically
    }
}

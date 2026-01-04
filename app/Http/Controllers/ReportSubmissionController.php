<?php

namespace App\Http\Controllers;

use App\Models\ReportSubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReportSubmissionController extends Controller
{
    public function store(Request $request){

        $request->validate([
            'report_id' => ['required', 'uuid', 'exists:reports,id'],
            'description' => ['nullable', 'string'],
            'proofs' => ['nullable', 'array'],
            'proofs.*' => ['file', 'mimes:jpg,jpeg,png,pdf', 'max:10240'],
        ]);

        $submission = ReportSubmission::create([
            'report_id' => $request->report_id,
            'field_officer_id' => Auth::id(),
            'status' => 'submitted'
        ]);

        if($request->hasFile('proofs')){
            foreach($request->file('proofs') as $file){
                $submission->addMedia($file)->toMediaCollection('proofs');
            }
        }

        return redirect()->back()->with('success', 'Report submitted successfully.');
    }
}
<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\ReportSubmission;
use App\Notifications\ReportSubmissionAccepted;
use App\Notifications\ReportSubmissionReturned;
use App\Notifications\ReportSubmissionSubmittedConfirmation;
use App\Notifications\ReportSubmissionSubmittedForFocalPerson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;


class ReportSubmissionController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'report_id' => ['required', 'uuid', 'exists:reports,id'],
            'description' => ['nullable', 'string'],
            'submission_data' => ['nullable', 'array'],
        ]);



        $report = Report::findOrFail($request->report_id);

        // dd($report->form_schema);
        // dd($request->submission_data);

        // Determine timeliness
        $submittedAt = now();
        $deadline = $report->deadline;

        $submittedDate = $submittedAt->startOfDay();
        $deadlineDate = $deadline->startOfDay();

        if ($submittedDate->lt($deadlineDate)) {
            $timeliness = 'early';
        } elseif ($submittedDate->eq($deadlineDate)) {
            $timeliness = 'on_time';
        } else {
            $timeliness = 'late';
        }


            $submission = ReportSubmission::create([
                'report_id' => $request->report_id,
                'field_officer_id' => Auth::id(),
                'description' => $request->description,
                'status' => 'submitted',
                'submitted_at' => $submittedAt,
                'timeliness' => $timeliness,
                'data' => [],
            ]);

            $finalData = [];

            if ($request->file('submission_data')) {

                foreach ($request->file('submission_data') as $fieldId => $files) {


                    $files = is_array($files) ? $files : [$files];
                    $urls = [];

                    foreach ($files as $file) {
                        $media = $submission
                            ->addMedia($file)
                            ->withCustomProperties(['field_id' => $fieldId])
                            ->toMediaCollection('submission_attachments');

                        $urls[] = $media->getUrl();
                    }

                    $finalData[$fieldId] = $urls;
                }
            }

            $submission->update([
                'data' => $finalData
            ]);

            $submission->load(['report.program', 'fieldOfficer']);

            $submission->fieldOfficer->notify(new ReportSubmissionSubmittedConfirmation($submission));
            $submission->report->coordinator->notify(new ReportSubmissionSubmittedForFocalPerson($submission));


            return redirect()->back()->with('success', 'Report submitted successfully.');
    }


    public function updateStatus(Request $request, ReportSubmission $reportSubmission)
    {
        $request->validate([
            'status' => [
                'required',
                'string',
                Rule::in(['accepted', 'returned']),
            ],
            'remarks' => [
                Rule::requiredIf($request->status === 'returned'),
                'nullable',
                'string',
            ],
        ]);

        $reportSubmission->load(['report.program', 'fieldOfficer']);

        if($request->status === 'accepted'){

            $reportSubmission->fieldOfficer->notify(new ReportSubmissionAccepted($reportSubmission));
        }

        if($request->status === 'returned'){

            $reportSubmission->fieldOfficer->notify(new ReportSubmissionReturned($reportSubmission));
        }



        $data = [
            'status' => $request->status,
        ];

        if ($request->status === 'returned') {
            $data['remarks'] = $request->remarks;
        }

        $reportSubmission->update($data);





        return redirect()->back()->with('success', 'Report Submission Updated Successfully');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'description' => ['nullable', 'string'],
            'submission_data' => ['nullable', 'array'],
            'files_to_delete' => ['nullable', 'json'],
        ]);

        $submission = ReportSubmission::with('report')->findOrFail($id);
        $report = $submission->report;

        // Check if user is authorized
        if ($submission->field_officer_id !== Auth::id()) {
            abort(403, 'You are not authorized to update this submission.');
        }


        $deadlinePassed = $report->deadline && now()->gt($report->deadline);

        // Handle file deletions
        $filesToDelete = $request->input('files_to_delete')
            ? json_decode($request->input('files_to_delete'), true)
            : [];

        $currentData = $submission->data ?? [];

        if (!empty($filesToDelete)) {
            $mediaToDelete = $submission->getMedia('submission_attachments')
                ->whereIn('id', $filesToDelete);

            foreach ($mediaToDelete as $media) {
                $media->delete();
            }

            // Clean up data array
            foreach ($filesToDelete as $fileId) {
                $media = $submission->getMedia('submission_attachments')
                    ->where('id', $fileId)
                    ->first();

                if ($media) {
                    $fileUrl = $media->getUrl();

                    foreach ($currentData as $fieldId => $urls) {
                        if (is_array($urls)) {
                            $currentData[$fieldId] = array_filter($urls, function($url) use ($fileUrl) {
                                return $url !== $fileUrl;
                            });

                            if (empty($currentData[$fieldId])) {
                                unset($currentData[$fieldId]);
                            }
                        }
                    }
                }
            }
        }

        // Process new file uploads
        $finalData = $currentData;

        if ($request->file('submission_data')) {
            foreach ($request->file('submission_data') as $fieldId => $files) {
                $files = is_array($files) ? $files : [$files];
                $urls = $finalData[$fieldId] ?? [];

                foreach ($files as $file) {
                    $media = $submission
                        ->addMedia($file)
                        ->withCustomProperties(['field_id' => $fieldId])
                        ->toMediaCollection('submission_attachments');

                    $urls[] = $media->getUrl();
                }

                $finalData[$fieldId] = $urls;
            }
        }

        // Determine if content actually changed
        $hasChanges = $request->description !== $submission->description
            || json_encode($finalData) !== json_encode($submission->data);

        if (!$hasChanges) {
            return redirect()->back()->with('info', 'No changes were made to the submission.');
        }


        $isResubmitted = false;

        if($submission->status === 'returned'){
            $isResubmitted = true;
        }

        // Update the submission
        $submission->update([
            'description' => $request->description,
            'data' => $finalData,
            'status' => $isResubmitted ? 'submitted' : $submission->status,
            'updated_at' => now(),
        ]);

        // Optionally add a note about the update
        activity()
        ->causedBy(Auth::user())
        ->withProperties([
            'changes' => [
                'description_changed' => true,
                'files_updated' => true,
            ]
        ])
        ->log('submission_updated');

        return redirect()->back()->with('success', 'Report submission updated successfully.');
    }

}

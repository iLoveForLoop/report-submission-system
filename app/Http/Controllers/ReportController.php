<?php

namespace App\Http\Controllers;

use App\Models\Program;
use App\Models\Report;
use App\Models\User;
use App\Notifications\NewReportAdded;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Illuminate\Validation\ValidationException;

class ReportController extends Controller
{
    public function store(Request $request)
    {
        $formSchema = $request->input('form_schema');

        if (is_string($formSchema)) {
            $formSchema = json_decode($formSchema, true) ?? [];
        }

        if (count($formSchema) === 0) {
            throw ValidationException::withMessages([
                'form_schema' => 'Please add at least one field before submitting.',
            ]);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'program_id' => 'required|exists:programs,id',
            'deadline' => 'required|date',
            'final_deadline' => 'nullable|date|after_or_equal:deadline',
            'template_files' => 'nullable|array',
            'template_files.*' => 'file|max:10240',
            'reference_files' => 'nullable|array',
            'reference_files.*' => 'file|max:10240',
        ]);

        $validated['form_schema'] = $formSchema;

        $report = auth()->user()->createdReports()->create($validated);

        if($request->hasFile('template_files')){

            foreach($request->file('template_files') as $file){
                $report->addMedia($file)->toMediaCollection('templates');
            }

        }

        if($request->hasFile('reference_files')){

            foreach($request->file('reference_files') as $file){
                $report->addMedia($file)->toMediaCollection('references');
            }

        }

        $fieldOfficers = User::role('field_officer')->get();

        Notification::send($fieldOfficers, new NewReportAdded($report));




        return redirect()->back()->with('success', 'Report created successfully.');
    }


    public function storeForProgramHead(Request $request, Program $program)
    {

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'program_id' => 'required|exists:programs,id',
            'deadline' => 'required|date',
            'final_deadline' => 'nullable|date|after_or_equal:deadline',
            'form_schema' => 'nullable|json',

            'template_files' => 'nullable|array',
            'template_files.*' => 'file|max:10240',
            'reference_files' => 'nullable|array',
            'reference_files.*' => 'file|max:10240',
        ]);


        if (isset($validated['form_schema'])) {

            $validated['form_schema'] = json_decode($validated['form_schema'], true);
        }

        $report = $program->coordinator->createdReports()->create($validated);

        if($request->hasFile('template_files')){

            foreach($request->file('template_files') as $file){
                $report->addMedia($file)->toMediaCollection('templates');
            }

        }

        if($request->hasFile('reference_files')){

            foreach($request->file('reference_files') as $file){
                $report->addMedia($file)->toMediaCollection('references');
            }

        }

        $fieldOfficers = User::role('field_officer')->get();

        Notification::send($fieldOfficers, new NewReportAdded($report));




        return redirect()->back()->with('success', 'Report created successfully.');
    }

    public function update(Request $request, Report $report)
    {
        // dd('here');
        // Ensure only the coordinator who created the report can edit it
        // abort_if($report->created_by !== auth()->id(), 403);
        // dd($request->all());

        $validated = $request->validate([
            'title'          => 'required|string|max:255',
            'description'    => 'nullable|string',
            // 'program_id'     => 'required|exists:programs,id',
            'deadline'       => 'required|date',
            // 'final_deadline' => 'nullable|date|after_or_equal:deadline',
            'form_schema'    => 'nullable|json',

            'template_files'   => 'nullable|array',
            'template_files.*' => 'file|max:10240',
            'reference_files'   => 'nullable|array',
            'reference_files.*' => 'file|max:10240',
        ]);



        // Decode form_schema JSON if present
        if (isset($validated['form_schema'])) {
            $validated['form_schema'] = json_decode($validated['form_schema'], true);
        }

        // Update the report fields (no media or files in here)
        $report->update(collect($validated)->except(['template_files', 'reference_files'])->toArray());

        // Append new template files — existing ones are kept
        if ($request->hasFile('template_files')) {
            foreach ($request->file('template_files') as $file) {
                $report->addMedia($file)->toMediaCollection('templates');
            }
        }

        // Append new reference files — existing ones are kept
        if ($request->hasFile('reference_files')) {
            foreach ($request->file('reference_files') as $file) {
                $report->addMedia($file)->toMediaCollection('references');
            }
        }



        return redirect()->back()->with('success', 'Report updated successfully.');
    }

    public function destroy(Report $report)
    {
        $report->delete();



        return redirect()->back()->with('success', 'Report deleted successfully.');
    }
}

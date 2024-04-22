<?php

namespace App\Http\Controllers;

use App\Models\Form;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class QuestionController extends Controller
{
    public function store(Request $request, $formSlug)
    {
        $form = Form::where('slug', $formSlug)->first();
        if (!$form) {
            return response()->json([
                'message' => 'Form not found'
            ], 404);
        }
        if ($form->creator_id != $request->user()->id) {
            return response()->json([
                'message' => 'Forbidden access'
            ], 403);
        }
        $rules = [
            'name' => 'required',
            'choice_type' => 'required|in:short answer,paragraph,date,time,multiple choice,dropdown,checkboxes',
            'choices' => 'array|required_if:choice_type,multiple choice,dropdown'
        ];
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Invalid field',
                'errors' => $validator->errors()
            ], 422);
        }
        $question = $form->questions()->create([
            'name' => $request->input('name'),
            'choice_type' => $request->input('choice_type'),
            'is_required' => $request->input('is_required') == 'true',
            'choices' => implode(',', $request->input('choices')),
        ]);
        return response()->json([
            'message' => 'create question success',
            'question' => $question
        ]);
    }
    public function destroy(Request $request, $formSlug, $id)
    {
        $form = Form::where('slug', $formSlug)->first();
        if (!$form) {
            return response()->json([
                'message' => 'Form not found'
            ], 404);
        }
        $question = $form->questions()->where('id', $id)->first();
        if (!$question) {
            return response()->json([
                'message' => 'Form not found'
            ], 404);
        }
        if ($form->creator_id != $request->user()->id) {
            return response()->json([
                'message' => 'Forbidden access'
            ], 403);
        }
        $question->delete();
        return response()->json([
            'message' => 'Remove question success'
        ]);
    }
}

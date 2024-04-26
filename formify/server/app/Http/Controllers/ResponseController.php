<?php

namespace App\Http\Controllers;

use App\Models\Form;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ResponseController extends Controller
{
    public function index(Request $request, $slug)
    {
        $form = Form::where('slug', $slug)->first();
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
        $formated = $form->responses->map(function ($response) use ($form) {
            $answers = [];
            foreach ($response->answers as $key => $answer) {
                $answers[$answer->question->name . $key] = $answer->value;
            }
            return [
                'date' => $form->date,
                'user' => $response->user->only(['id', 'name', 'email', 'email_verified_at']),
                'answers' => $answers
            ];
        });
        return response()->json([
            'message' => 'Get response success',
            'responses' => $formated
        ]);
    }
    public function store(Request $request, $slug)
    {
        $form = Form::where('slug', $slug)->first();
        if (!$form) {
            return response()->json([
                'message' => 'Form not found'
            ], 404);
        }
        if ($form->allowedDomains()->count() > 0 && $form->creator_id != $request->user()->id && $form->allowedDomains()->where('domain', 'like', explode('@', $request->user()->email)[1])->count() < 1) {
            return response()->json([
                'message' => 'forbidden access'
            ], 403);
        }
        if ($form->limit_one_response && $form->responses()->where('user_id', $request->user()->id)->count() > 0) {
            return response()->json([
                'message' => 'You cannot submit form twice'
            ], 422);
        }
        $validator = Validator::make($request->all(), [
            'answers' => 'array',
            // 'answers.*.question_id'=>'in'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Invalid field',
                'errors' => $validator->errors()
            ], 422);
        }
        $response = $form->responses()->create([
            'date' => now(),
            'user_id' => $request->user()->id,
        ]);
        foreach ($request->input('answers') as $answer) {

            $response->answers()->create($answer);
        }
        return response()->json([
            'message' => 'Submit response success'
        ]);
    }
}

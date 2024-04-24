<?php

namespace App\Http\Controllers;

use App\Models\AllowedDomain;
use App\Models\Form;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FormController extends Controller
{
    public function index(Request $request)
    {
        $form = Form::where('creator_id', $request->user()->id)->get();
        return response()->json([
            'message' => 'Get all forms success',
            'forms' => $form
        ]);
    }
    public function store(Request $request)
    {
        $rules = [
            'name' => 'required',
            'slug' => 'required|unique:forms,slug',
            'allowed_domains' => 'array'
        ];
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Invalid field',
                'errors' => $validator->errors()
            ], 422);
        }
        $form = Form::create([
            'name' => $request->name,
            'slug' => $request->slug,
            'description' => $request->description,
            'limit_one_response' => $request->limit_one_response == 'true',
            'creator_id' => $request->user()->id
        ]);
        foreach ($request->input('allowed_domains', []) as $domain) {
            if (!empty($domain)) {
                $form->allowedDomains()->create([
                    'domain' => $domain
                ]);
            }
        }
        return response()->json([
            'message' => 'Create form success',
            'form' => $form
        ]);
    }
    public function show(Request $request, $slug)
    {
        $form = Form::where('slug', $slug)->with(['questions'])->first();
        if (!$form) return response()->json([
            'message' => 'Form not found'
        ], 404);
        if ($form->allowedDomains()->count() > 0 && $form->creator_id != $request->user()->id && $form->allowedDomains()->where('domain', 'like', explode('@', $request->user()->email)[1])->count() < 1) {
            return response()->json([
                'message' => 'Forbidden access'
            ], 403);
        }
        $formated = $form->toArray();
        $formated['allowed_domains'] = $form->allowedDomains->map(fn ($item) => $item->domain);
        return response()->json([
            'message' => 'Get form success',
            'form' => $formated
        ]);
    }
}

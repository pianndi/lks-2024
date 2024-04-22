<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FormController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\ResponseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix(('v1'))->group(function () {
    Route::post('auth/login', [AuthController::class, 'login'])->name('login');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('auth/logout', [AuthController::class, 'logout'])->name('logout');

        Route::get('forms', [FormController::class, 'index']);
        Route::post('forms', [FormController::class, 'store']);
        Route::get('forms/{slug}', [FormController::class, 'show']);


        Route::post('forms/{slug}/questions', [QuestionController::class, 'store']);
        Route::delete('forms/{slug}/questions/{id}', [QuestionController::class, 'destroy']);

        Route::get('forms/{slug}/responses', [ResponseController::class, 'index']);
        Route::post('forms/{slug}/responses', [ResponseController::class, 'store']);
    });
});

<?php

use App\Http\Controllers\BmiController;
use Illuminate\Support\Facades\Route;

Route::post('/bmi', [BmiController::class, 'calculate']);

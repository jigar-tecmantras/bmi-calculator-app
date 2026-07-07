<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BmiController extends Controller
{
    public function calculate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'height' => ['required', 'numeric', 'gt:0'],
            'weight' => ['required', 'numeric', 'gt:0'],
            'unit' => ['required', 'string', 'in:metric,imperial'],
        ]);

        $height = (float) $validated['height'];
        $weight = (float) $validated['weight'];
        $unit = strtolower($validated['unit']);

        if ($unit === 'imperial') {
            $heightInMeters = $height * 0.0254;
            $weightInKg = $weight * 0.45359237;
        } else {
            $heightInMeters = $height / 100;
            $weightInKg = $weight;
        }

        $bmi = round($weightInKg / ($heightInMeters * $heightInMeters), 1);
        [$category, $suggestion] = $this->categoryAndSuggestion($bmi);

        return response()->json([
            'bmi' => $bmi,
            'category' => $category,
            'suggestion' => $suggestion,
        ]);
    }

    private function categoryAndSuggestion(float $bmi): array
    {
        if ($bmi < 18.5) {
            return [
                'Underweight',
                'Consider nutrient-dense foods, moderate resistance training, and a check in with your doctor.',
            ];
        }

        if ($bmi < 25) {
            return [
                'Normal',
                'Continue the healthy habits, stay active, and schedule routine wellness screenings.',
            ];
        }

        return [
            'Overweight',
            'Focus on a balanced plate, move more, and coordinate with your health team before big changes.',
        ];
    }
}

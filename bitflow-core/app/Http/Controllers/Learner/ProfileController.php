<?php

namespace App\Http\Controllers\Learner;

use App\Http\Controllers\Controller;
use App\Services\ProfileService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function __construct(
        private ProfileService $profileService
    ) {}

    /**
     * Get complete learner profile
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();
        $student = $user->student;

        if (!$student) {
            return response()->json(['message' => 'Student profile not found'], 404);
        }

        $profile = $this->profileService->getCompleteProfile($student->id);

        return response()->json($profile);
    }

    /**
     * Get attendance data with graph
     */
    public function attendance(Request $request): JsonResponse
    {
        $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'subject_id' => 'nullable|uuid|exists:subjects,id',
        ]);

        $user = $request->user();
        $student = $user->student;

        if (!$student) {
            return response()->json(['message' => 'Student profile not found'], 404);
        }

        $attendanceData = $this->profileService->getAttendanceData($student->id, [
            'start_date' => $request->input('start_date', now()->startOfMonth()),
            'end_date' => $request->input('end_date', now()->endOfMonth()),
            'subject_id' => $request->input('subject_id'),
        ]);

        return response()->json($attendanceData);
    }

    /**
     * Get fee status with detailed breakdown
     */
    public function feeStatus(Request $request): JsonResponse
    {
        $user = $request->user();
        $student = $user->student;

        if (!$student) {
            return response()->json(['message' => 'Student profile not found'], 404);
        }

        $feeStatus = $this->profileService->getFeeStatus($student->id);

        return response()->json($feeStatus);
    }

    /**
     * Get academic performance summary
     */
    public function performance(Request $request): JsonResponse
    {
        $user = $request->user();
        $student = $user->student;

        if (!$student) {
            return response()->json(['message' => 'Student profile not found'], 404);
        }

        $performance = $this->profileService->getPerformanceSummary($student->id);

        return response()->json($performance);
    }

    /**
     * Get timetable for the student
     */
    public function timetable(Request $request): JsonResponse
    {
        $user = $request->user();
        $student = $user->student;

        if (!$student) {
            return response()->json(['message' => 'Student profile not found'], 404);
        }

        $timetable = $this->profileService->getTimetable($student->id);

        return response()->json($timetable);
    }

    /**
     * Get library resources issued to student
     */
    public function libraryResources(Request $request): JsonResponse
    {
        $user = $request->user();
        $student = $user->student;

        if (!$student) {
            return response()->json(['message' => 'Student profile not found'], 404);
        }

        $resources = $this->profileService->getLibraryResources($student->id);

        return response()->json($resources);
    }

    /**
     * Update profile information
     */
    public function update(Request $request): JsonResponse
    {
        $request->validate([
            'phone' => 'nullable|string|max:15',
            'emergency_contact' => 'nullable|string|max:15',
            'address' => 'nullable|string|max:500',
            'bio' => 'nullable|string|max:1000',
        ]);

        $user = $request->user();
        $student = $user->student;

        if (!$student) {
            return response()->json(['message' => 'Student profile not found'], 404);
        }

        $updated = $this->profileService->updateProfile($student->id, $request->only([
            'phone',
            'emergency_contact',
            'address',
            'bio',
        ]));

        return response()->json([
            'message' => 'Profile updated successfully',
            'profile' => $updated,
        ]);
    }

    /**
     * Upload profile picture
     */
    public function uploadProfilePicture(Request $request): JsonResponse
    {
        $request->validate([
            'profile_picture' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $user = $request->user();
        $student = $user->student;

        if (!$student) {
            return response()->json(['message' => 'Student profile not found'], 404);
        }

        $profilePicturePath = $this->profileService->uploadProfilePicture(
            $student->id,
            $request->file('profile_picture')
        );

        return response()->json([
            'message' => 'Profile picture uploaded successfully',
            'profile_picture_url' => $profilePicturePath,
        ]);
    }
}

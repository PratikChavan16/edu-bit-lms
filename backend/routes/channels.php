<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

// Private user channel - users can only listen to their own channel
Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Public channels - available to all authenticated users with God Mode
// These channels broadcast platform-wide events for Bitflow Owners/Admins

Broadcast::channel('universities', function ($user) {
    // Only Bitflow Owners and Admins can listen to all universities
    return $user->hasRole(['bitflow_owner', 'bitflow_admin']);
});

Broadcast::channel('colleges', function ($user) {
    // Only Bitflow Owners and Admins can listen to all colleges
    return $user->hasRole(['bitflow_owner', 'bitflow_admin']);
});

Broadcast::channel('users', function ($user) {
    // Only Bitflow Owners and Admins can listen to all users
    return $user->hasRole(['bitflow_owner', 'bitflow_admin']);
});

// University-specific channels - filtered by university_id
Broadcast::channel('universities.{universityId}', function ($user, $universityId) {
    // User can listen if they belong to this university OR have God Mode
    return $user->university_id === $universityId || 
           $user->hasRole(['bitflow_owner', 'bitflow_admin']);
});


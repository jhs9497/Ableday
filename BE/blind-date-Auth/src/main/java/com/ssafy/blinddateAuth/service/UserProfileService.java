package com.ssafy.blinddateAuth.service;

import com.ssafy.blinddateAuth.entity.UserProfile;

import java.util.Optional;

public interface UserProfileService {
    Optional<UserProfile> getUserProfileByUserId(String userId);
    Optional<UserProfile> getUserProfileById(String id);
    UserProfile setUserProfile(UserProfile userProfile);
}

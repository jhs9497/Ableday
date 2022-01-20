package com.ssafy.blinddateAuth.service;

import com.ssafy.blinddateAuth.entity.UserAuth;
import com.ssafy.blinddateAuth.entity.UserProfile;
import com.ssafy.blinddateAuth.repository.UserAuthRepository;
import com.ssafy.blinddateAuth.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service("UserProfileService")
public class UserProfileServiceImpl implements UserProfileService {
    @Autowired
    UserAuthRepository userAuthRepository;
    @Autowired
    UserProfileRepository userProfileRepository;

    @Override
    public Optional<UserProfile> getUserProfileByUserId(String userId) {
        Optional<UserAuth> userAuthOptional = userAuthRepository.findByUserId(userId);
        if(userAuthOptional.isPresent())
            return userProfileRepository.findById(userAuthOptional.get().getId());
        return Optional.empty();
    }

    @Override
    public Optional<UserProfile> getUserProfileById(String id) { return userProfileRepository.findById(id); }

    @Override
    public UserProfile setUserProfile(UserProfile userProfile) { return userProfileRepository.save(userProfile); }
}

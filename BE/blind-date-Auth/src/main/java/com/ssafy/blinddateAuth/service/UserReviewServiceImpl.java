package com.ssafy.blinddateAuth.service;

import com.ssafy.blinddateAuth.entity.UserProfile;
import com.ssafy.blinddateAuth.entity.UserReview;
import com.ssafy.blinddateAuth.repository.UserProfileRepository;
import com.ssafy.blinddateAuth.repository.UserReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service("UserReviewService")
public class UserReviewServiceImpl implements UserReviewService {

    @Autowired
    UserReviewRepository userReviewRepository;

    @Autowired
    UserProfileService userProfileService;

    @Override
    public UserReview saveReview(UserReview userReview) {
        String userId = userReview.getUserId();
        UserProfile userProfile = userProfileService.getUserProfileByUserId(userId).get();
        List<UserReview> reviewList = userReviewRepository.findByUserId(userId);
        int manner = userReview.getManner();
        int humorous = userReview.getHumorous();
        int likeability = userReview.getLikeability();
        int animal_accuracy = userReview.getAnimal_accuracy();
        for(UserReview review : reviewList) {
            manner += review.getManner();
            humorous += review.getHumorous();
            likeability += review.getLikeability();
            animal_accuracy += review.getAnimal_accuracy();
        }
        int reviewCnt = userProfile.getReviewCount() + 1;
        userProfile.setReviewCount(reviewCnt);
        userProfile.setManner(((float) manner / (float) reviewCnt));
        userProfile.setHumorous(((float) humorous / (float) reviewCnt));
        userProfile.setLikeability(((float) likeability / (float) reviewCnt));
        userProfile.setAnimal_accuracy(((float) animal_accuracy / (float) reviewCnt));
        userProfileService.setUserProfile(userProfile);
        return userReviewRepository.save(userReview);
    }

    @Override
    public Optional<UserReview> getReviewById(String id) {
        return userReviewRepository.findById(id);
    }
}

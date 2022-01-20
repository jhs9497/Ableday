package com.ssafy.blinddateAuth.service;

import com.ssafy.blinddateAuth.entity.UserReview;

import java.util.Optional;

public interface UserReviewService {
    UserReview saveReview(UserReview userReview);
    Optional<UserReview> getReviewById(String id);
}

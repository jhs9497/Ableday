package com.ssafy.blinddateAuth.repository;
import com.ssafy.blinddateAuth.entity.UserReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserReviewRepository extends JpaRepository<UserReview, String> {
    List<UserReview> findByUserId(String userIds);
}

package com.ssafy.blinddateAuth.repository;

import com.ssafy.blinddateAuth.entity.UserFriend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserFriendRepository extends JpaRepository<UserFriend, String> {
    @Query("SELECT userId2 FROM UserFriend WHERE userId1 = :userId")
    List<String> findUserId2ByUserId1(@Param("userId") String userId);
    Optional<UserFriend> findByUserId1AndUserId2(String userId1, String userId2);
}
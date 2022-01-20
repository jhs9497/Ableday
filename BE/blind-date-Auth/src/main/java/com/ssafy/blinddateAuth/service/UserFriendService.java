package com.ssafy.blinddateAuth.service;

import com.ssafy.blinddateAuth.entity.UserFriend;

import java.util.List;
import java.util.Optional;

public interface UserFriendService {
    void addFriend(String userId1, String userId2);
    Optional<UserFriend> getUserFriendById(String id);
    List<String> getUserFriendListByUserId(String userId);
    Optional<UserFriend> getByUserId1AndUserId2(String userId1, String userId2);
    boolean deleteFriend(String userId1, String UserId2);
}

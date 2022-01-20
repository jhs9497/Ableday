package com.ssafy.blinddateAuth.service;

import com.ssafy.blinddateAuth.entity.UserFriend;
import com.ssafy.blinddateAuth.repository.UserAuthRepository;
import com.ssafy.blinddateAuth.repository.UserFriendRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service("UserFriendService")
public class UserFriendServiceImpl implements UserFriendService{
    @Autowired
    UserAuthRepository userAuthRepository;
    @Autowired
    UserFriendRepository userFriendRepository;

    @Override
    public void addFriend(String userId1, String userId2) {
        // PK 생성
        Random rand = new Random();
        StringBuffer buf;
        while(true) {
            buf = new StringBuffer("F");
            // 10개의 난수 생성
            for(int i = 0; i < 10; i++)
                buf.append(rand.nextInt(10));
            // 소문자 알파벳 2개를 랜덤 위치에 삽입
            for(int i = 0; i < 2; i++)
                buf.insert(rand.nextInt(buf.length() - 1) + 1, (char)((rand.nextInt(26)) + 97));
            if(!getUserFriendById(buf.toString()).isPresent())
                break;
        }
        UserFriend userFriend = UserFriend.builder()
                .id(buf.toString())
                .userId1(userId1)
                .userId2(userId2)
                .build();
        userFriendRepository.save(userFriend);
    }

    @Override
    public Optional<UserFriend> getUserFriendById(String id) {
        return userFriendRepository.findById(id);
    }

    @Override
    public List<String> getUserFriendListByUserId(String userId) {
        return userFriendRepository.findUserId2ByUserId1(userId);
    }

    @Override
    public Optional<UserFriend> getByUserId1AndUserId2(String userId1, String userId2) {
        return userFriendRepository.findByUserId1AndUserId2(userId1, userId2);
    }

    @Override
    public boolean deleteFriend(String userId1, String userId2) {
        Optional<UserFriend> optionalUserFriend = getByUserId1AndUserId2(userId1, userId2);
        if(optionalUserFriend.isPresent()) {
            userFriendRepository.delete(optionalUserFriend.get());
            optionalUserFriend = getByUserId1AndUserId2(userId2, userId1);
            userFriendRepository.delete(optionalUserFriend.get());
            return true;
        }
        return false;
    }
}

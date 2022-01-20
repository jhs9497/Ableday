package com.ssafy.blinddateAuth.service;

import com.ssafy.blinddateAuth.entity.UserAuth;
import com.ssafy.blinddateAuth.entity.UserProfile;
import com.ssafy.blinddateAuth.repository.UserAuthRepository;
import com.ssafy.blinddateAuth.repository.UserProfileRepository;
import com.ssafy.blinddateAuth.vo.request.UserRegisterPostReq;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.Optional;
import java.util.Random;

@Service("UserAuthService")
public class UserAuthServiceImpl implements UserAuthService{
    @Autowired
    UserAuthRepository userAuthRepository;
    @Autowired
    UserProfileRepository userProfileRepository;
    @Autowired
    PasswordEncoder passwordEncoder;

    @Override
    public UserProfile createUser(UserRegisterPostReq userRegisterInfo) {
        // PK 생성
        Random rand = new Random();
        StringBuffer buf;
        while(true) {
            buf = new StringBuffer("U");
            // 10개의 난수 생성
            for(int i = 0; i < 10; i++)
                buf.append(rand.nextInt(10));
            // 소문자 알파벳 2개를 랜덤 위치에 삽입
            for(int i = 0; i < 2; i++)
                buf.insert(rand.nextInt(buf.length() - 1) + 1, (char)((rand.nextInt(26)) + 97));
            if(!getUserAuthById(buf.toString()).isPresent())
                break;
        }

        UserAuth userAuth = UserAuth.builder()
                .id(buf.toString())
                .userId(userRegisterInfo.getId())
                .password(passwordEncoder.encode(userRegisterInfo.getPassword()))
                .build();
        userAuthRepository.save(userAuth);

        UserProfile userProfile = UserProfile.builder()
                .id(buf.toString())
                .nickname(userRegisterInfo.getNickname())
                .gender(userRegisterInfo.getGender())
                .birthday(LocalDate.parse(userRegisterInfo.getBirthday(), DateTimeFormatter.ofPattern("yyyyMMdd")))
                .build();
        return userProfileRepository.save(userProfile);
    }

    @Override
    public Optional<UserAuth> getUserAuthByUserId(String userId) {
        return userAuthRepository.findByUserId(userId);
    }

    @Override
    public Optional<UserAuth> getUserAuthById(String id) {
        return userAuthRepository.findById(id);
    }

    @Override
    public boolean deleteUser(String userId) {
        Optional<UserAuth> userAuth = userAuthRepository.findByUserId(userId);
        if(!userAuth.isPresent()) return false;
        Optional<UserProfile> userProfile = userProfileRepository.findById(userAuth.get().getId());
        if(!userProfile.isPresent()) return false;
        userAuthRepository.delete(userAuth.get());
        userProfileRepository.delete(userProfile.get());
        return true;
    }
}

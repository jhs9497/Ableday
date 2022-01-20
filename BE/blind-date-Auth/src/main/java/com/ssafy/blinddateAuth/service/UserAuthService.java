package com.ssafy.blinddateAuth.service;

import com.ssafy.blinddateAuth.entity.UserAuth;
import com.ssafy.blinddateAuth.entity.UserProfile;
import com.ssafy.blinddateAuth.vo.request.UserRegisterPostReq;

import java.util.Optional;

public interface UserAuthService {
    UserProfile createUser(UserRegisterPostReq userRegisterInfo);
    Optional<UserAuth> getUserAuthByUserId(String userId);
    Optional<UserAuth> getUserAuthById(String id);
    boolean deleteUser(String id);
}

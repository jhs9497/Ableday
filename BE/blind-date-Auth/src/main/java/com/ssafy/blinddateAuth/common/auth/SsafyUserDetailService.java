package com.ssafy.blinddateAuth.common.auth;

import com.ssafy.blinddateAuth.entity.UserAuth;
import com.ssafy.blinddateAuth.entity.UserProfile;
import com.ssafy.blinddateAuth.service.UserAuthService;
import com.ssafy.blinddateAuth.service.UserProfileService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.Optional;


/**
 * 현재 액세스 토큰으로 부터 인증된 유저의 상세정보(활성화 여부, 만료, 롤 등) 관련 서비스 정의.
 */
@Component
public class SsafyUserDetailService implements UserDetailsService{
	@Autowired
	UserAuthService userAuthService;
	@Autowired
    UserProfileService userProfileService;
	
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Optional<UserAuth> optionalUserAuth = userAuthService.getUserAuthByUserId(username);
    	Optional<UserProfile> optionalUserProfile = userProfileService.getUserProfileByUserId(username);

    	if(username != null) {
    		SsafyUserDetails userDetails = new SsafyUserDetails(username);
    		return userDetails;
    	}
    	return null;
    }
}

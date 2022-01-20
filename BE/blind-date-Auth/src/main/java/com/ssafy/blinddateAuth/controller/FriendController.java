package com.ssafy.blinddateAuth.controller;

import com.ssafy.blinddateAuth.common.auth.SsafyUserDetails;
import com.ssafy.blinddateAuth.entity.UserProfile;
import com.ssafy.blinddateAuth.service.UserAuthService;
import com.ssafy.blinddateAuth.service.UserFriendService;
import com.ssafy.blinddateAuth.service.UserProfileService;
import com.ssafy.blinddateAuth.vo.request.UserFriendReq;
import com.ssafy.blinddateAuth.vo.response.FriendGetRes;
import com.ssafy.blinddateAuth.vo.response.Message;
import com.ssafy.blinddateAuth.vo.response.StatusEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/friend")
public class FriendController {
    @Autowired
    UserFriendService userFriendService;

    @Autowired
    UserProfileService userProfileService;

    @Autowired
    UserAuthService userAuthService;

    @PostMapping("")
    public ResponseEntity<Message> addFriend(Authentication authentication,
                                             @RequestBody(required = true) UserFriendReq userFriendReq) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", StandardCharsets.UTF_8));
        SsafyUserDetails userDetails = (SsafyUserDetails)authentication.getDetails();
        Message message = new Message();
        String userId1 = userDetails.getUsername();
        String userPK = userFriendReq.getUserId();
        if(!userAuthService.getUserAuthById(userPK).isPresent()) {
            message.setStatus(StatusEnum.BAD_REQUEST);
            message.setMessage("USER DOESN'T EXIST");
            return new ResponseEntity<>(message, headers, HttpStatus.BAD_REQUEST);
        }
        String userId2 = userAuthService.getUserAuthById(userPK).get().getUserId();

        // 이미 친구인지 확인
        List<String> userFriends = userFriendService.getUserFriendListByUserId(userId1);
        if(userFriends != null && userFriends.contains(userId2)) {
            // 이미 친구
            message.setStatus(StatusEnum.CONFLICT);
            message.setMessage("ALREADY FRIEND");
            return new ResponseEntity<>(message, headers, HttpStatus.CONFLICT);
        } else {
            // 친구 쌍방향 추가
            userFriendService.addFriend(userId1, userId2);
            userFriendService.addFriend(userId2, userId1);
            message.setStatus(StatusEnum.OK);
            message.setMessage("ADD FRIEND SUCCESS");
            return new ResponseEntity<>(message, headers, HttpStatus.OK);
        }
    }

    @GetMapping("")
    public ResponseEntity<Message> getFriendList(Authentication authentication) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", StandardCharsets.UTF_8));
        SsafyUserDetails userDetails = (SsafyUserDetails)authentication.getDetails();
        String userId1 = userDetails.getUsername();
        Message message = new Message();

        List<String> userFriends = userFriendService.getUserFriendListByUserId(userId1);
        List<FriendGetRes> friendList = new ArrayList<>();
        for(String friend : userFriends) {
            Optional<UserProfile> optionalUserProfile = userProfileService.getUserProfileByUserId(friend);
            if(!optionalUserProfile.isPresent())
                continue;
            UserProfile userProfile = optionalUserProfile.get();
            friendList.add(FriendGetRes.builder()
            .id(userProfile.getId())
            .nickname(userProfile.getNickname())
            .animal(userProfile.getAnimal())
            .gender(userProfile.getGender())
            .keyword1(userProfile.getIntroduction_keyword1())
            .keyword2(userProfile.getIntroduction_keyword2())
            .keyword3(userProfile.getIntroduction_keyword3())
            .keyword4(userProfile.getIntroduction_keyword4())
            .keyword5(userProfile.getIntroduction_keyword5())
            .build());
        }
        message.setStatus(StatusEnum.OK);
        message.setMessage("FRIEND LIST");
        message.setData(friendList);
        return new ResponseEntity<>(message, headers, HttpStatus.OK);
    }

    @DeleteMapping("")
    public ResponseEntity<Message> deleteFriend(Authentication authentication,
                                                @RequestBody(required = true) UserFriendReq userFriendReq) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", StandardCharsets.UTF_8));
        SsafyUserDetails userDetails = (SsafyUserDetails)authentication.getDetails();
        Message message = new Message();
        String userId1 = userDetails.getUsername();
        String userPK = userFriendReq.getUserId();
        if(!userAuthService.getUserAuthById(userPK).isPresent()) {
            message.setStatus(StatusEnum.BAD_REQUEST);
            message.setMessage("USER DOESN'T EXIST");
            return new ResponseEntity<>(message, headers, HttpStatus.BAD_REQUEST);
        }
        String userId2 = userAuthService.getUserAuthById(userPK).get().getUserId();

        // 이미 친구인지 확인
        List<String> userFriends = userFriendService.getUserFriendListByUserId(userId1);
        if(userFriends != null && userFriends.contains(userId2)) {
            // 친구 목록에 존재
            userFriendService.deleteFriend(userId1, userId2);
            message.setStatus(StatusEnum.OK);
            message.setMessage("DELETE FRIEND SUCCESS");
            return new ResponseEntity<>(message, headers, HttpStatus.OK);
        } else {
            // 친구 삭제 실패
            message.setStatus(StatusEnum.BAD_REQUEST);
            message.setMessage("DELETE FRIEND FAILED");
            return new ResponseEntity<>(message, headers, HttpStatus.BAD_REQUEST);
        }
    }
}

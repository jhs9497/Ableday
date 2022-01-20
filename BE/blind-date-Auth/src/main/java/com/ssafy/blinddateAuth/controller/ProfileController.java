package com.ssafy.blinddateAuth.controller;

import com.fasterxml.jackson.databind.node.TextNode;
import com.ssafy.blinddateAuth.common.auth.SsafyUserDetails;
import com.ssafy.blinddateAuth.entity.UserProfile;
import com.ssafy.blinddateAuth.entity.UserReview;
import com.ssafy.blinddateAuth.service.UserAuthService;
import com.ssafy.blinddateAuth.service.UserProfileService;
import com.ssafy.blinddateAuth.service.UserReviewService;
import com.ssafy.blinddateAuth.vo.request.AnimalPostReq;
import com.ssafy.blinddateAuth.vo.request.MyPagePutReq;
import com.ssafy.blinddateAuth.vo.request.UserReivewPostReq;
import com.ssafy.blinddateAuth.vo.response.Message;
import com.ssafy.blinddateAuth.vo.response.StatusEnum;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import java.nio.charset.StandardCharsets;
import java.util.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {
    @Autowired
    UserAuthService userAuthService;

    @Autowired
    UserProfileService userProfileService;

    @Autowired
    UserReviewService userReviewService;

    @GetMapping("/mypage")
    public ResponseEntity<Message> myPage(Authentication authentication) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", StandardCharsets.UTF_8));
        Message message = new Message();
        SsafyUserDetails userDetails = (SsafyUserDetails)authentication.getDetails();
        String userId = userDetails.getUsername();

        Optional<UserProfile> userOptional = userProfileService.getUserProfileByUserId(userId);
        if(userOptional.isPresent()) {
            message.setStatus(StatusEnum.OK);
            message.setMessage("USER DATA");
            message.setData(userOptional.get());
            return new ResponseEntity<>(message, headers, HttpStatus.OK);
        }
        message.setStatus(StatusEnum.BAD_REQUEST);
        message.setMessage("USER NOT FOUND");
        return new ResponseEntity<>(message, headers, HttpStatus.BAD_REQUEST);
    }

    @PutMapping("/mypage")
    public ResponseEntity<Message> myPage(Authentication authentication,
                                          @RequestBody MyPagePutReq myPagePutReq) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", StandardCharsets.UTF_8));
        Message message = new Message();
        SsafyUserDetails userDetails = (SsafyUserDetails)authentication.getDetails();
        String userId = userDetails.getUsername();

        Optional<UserProfile> userOptional = userProfileService.getUserProfileByUserId(userId);
        if(userOptional.isPresent()) {
            UserProfile userProfile = userOptional.get();
            userProfile.setNickname(myPagePutReq.getNickname());
            userProfile.setIntroduction_keyword1(myPagePutReq.getIntroduction_keyword1());
            userProfile.setIntroduction_keyword2(myPagePutReq.getIntroduction_keyword2());
            userProfile.setIntroduction_keyword3(myPagePutReq.getIntroduction_keyword3());
            userProfile.setIntroduction_keyword4(myPagePutReq.getIntroduction_keyword4());
            userProfile.setIntroduction_keyword5(myPagePutReq.getIntroduction_keyword5());
            userProfileService.setUserProfile(userProfile);

            message.setStatus(StatusEnum.OK);
            message.setMessage("USER INFO EDIT SUCCESS");
            return new ResponseEntity<>(message, headers, HttpStatus.OK);
        }
        message.setStatus(StatusEnum.BAD_REQUEST);
        message.setMessage("USER NOT FOUND");
        return new ResponseEntity<>(message, headers, HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/review")
    public ResponseEntity<Message> review(Authentication authentication,
                                          @RequestBody(required = true)UserReivewPostReq userReivewPostReq) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", StandardCharsets.UTF_8));
        SsafyUserDetails userDetails = (SsafyUserDetails)authentication.getDetails();
        String reviewer = userDetails.getUsername();
        System.out.println(userReivewPostReq.toString());
        String id = userReivewPostReq.getId();
        String userId = userAuthService.getUserAuthById(id).get().getUserId();

        Message message = new Message();
        // PK 생성
        Random rand = new Random();
        StringBuffer buf;
        while(true) {
            buf = new StringBuffer("R");
            // 10개의 난수 생성
            for(int i = 0; i < 10; i++)
                buf.append(rand.nextInt(10));
            // 소문자 알파벳 2개를 랜덤 위치에 삽입
            for(int i = 0; i < 2; i++)
                buf.insert(rand.nextInt(buf.length() - 1) + 1, (char)((rand.nextInt(26)) + 97));
            if(!userReviewService.getReviewById(buf.toString()).isPresent())
                break;
        }
        UserReview userReview = UserReview.builder()
                .id(buf.toString())
                .userId(userId)
                .reviewer(reviewer)
                .manner(userReivewPostReq.getManner())
                .humorous(userReivewPostReq.getHumorous())
                .likeability(userReivewPostReq.getLikeability())
                .animal_accuracy(userReivewPostReq.getAnimal_accuracy())
                .build();
        userReviewService.saveReview(userReview);
        message.setStatus(StatusEnum.OK);
        message.setMessage("REVIEW SAVED");
        return new ResponseEntity<>(message, headers, HttpStatus.OK);
    }

    @PostMapping("/image")
    public ResponseEntity<Message> imageUpload(@RequestHeader HttpHeaders requestHeaders,
                                              @RequestBody AnimalPostReq animalPostReq) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", StandardCharsets.UTF_8));
        JSONObject jsonObj = new JSONObject(requestHeaders);
        String authorization = jsonObj.get("authorization").toString();
        authorization = authorization.substring(authorization.indexOf("Bearer "), authorization.length() - 2);
        requestHeaders = new HttpHeaders();
        requestHeaders.set("Authorization", authorization);

        HttpEntity requestEntity = new HttpEntity(requestHeaders);
        String serverUrl = "http://localhost:8081/api/auth/getidfromjwt";
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.exchange(serverUrl, HttpMethod.GET, requestEntity, String.class);
        String userId = response.getBody();
        UserProfile userProfile = userProfileService.getUserProfileByUserId(userId).get();
        String gender = userProfile.getGender();

        serverUrl = "https://j5c105.p.ssafy.io/classification/resultoutput";
        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        String path = animalPostReq.getPath().get(0);
        System.out.println("Animal path = " + path);
        map.add("gender", gender);
        map.add("path", path);

        HttpEntity<?> httpEntity = new HttpEntity<Object>(map, headers);
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(serverUrl);
        UriComponents uriComponents = builder.build();

        ResponseEntity<String> resEntity = null;
        Message message = new Message();
        try {
            resEntity = restTemplate.exchange(uriComponents.toUriString(), HttpMethod.POST, httpEntity, String.class);
            message.setStatus(StatusEnum.OK);
            jsonObj = new JSONObject(resEntity.getBody());
            String animal = jsonObj.getString("result");
            message.setStatus(StatusEnum.OK);
            message.setMessage(animal);
            System.out.println(animal);
            userProfile.setAnimal(animal);
            userProfileService.setUserProfile(userProfile);
            return new ResponseEntity<>(message, headers, HttpStatus.OK);
        } catch (HttpClientErrorException e) {
            message.setStatus(StatusEnum.CONFLICT);
            message.setMessage(e.getResponseBodyAsString());
            return new ResponseEntity<>(message, headers, HttpStatus.CONFLICT);
        }
    }
}

package com.ssafy.blinddateAuth.controller;

import com.ssafy.blinddateAuth.common.auth.SsafyUserDetails;
import com.ssafy.blinddateAuth.common.util.JwtTokenUtil;
import com.ssafy.blinddateAuth.entity.UserAuth;
import com.ssafy.blinddateAuth.entity.UserProfile;
import com.ssafy.blinddateAuth.service.UserAuthService;
import com.ssafy.blinddateAuth.service.UserProfileService;
import com.ssafy.blinddateAuth.vo.request.UserRegisterPostReq;
import com.ssafy.blinddateAuth.vo.request.UserSignInPostReq;
import com.ssafy.blinddateAuth.vo.response.Message;
import com.ssafy.blinddateAuth.vo.response.StatusEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    UserAuthService userAuthService;
    @Autowired
    UserProfileService userProfileService;
    @Autowired
    PasswordEncoder passwordEncoder;

    @PostMapping("/signup")
    public ResponseEntity<Message> signup(@RequestBody(required = true) UserRegisterPostReq registerInfo) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", StandardCharsets.UTF_8));
        Message message = new Message();

        Optional<UserAuth> userOptional = userAuthService.getUserAuthByUserId(registerInfo.getId());
        if(userOptional.isPresent()) {
            message.setStatus(StatusEnum.CONFLICT);
            message.setMessage("ID ALREADY EXIST");
            return new ResponseEntity<>(message, headers, HttpStatus.CONFLICT);
        }
        userAuthService.createUser(registerInfo);
        message.setStatus(StatusEnum.CREATED);
        message.setMessage("SIGNUP SUCCESS");
        return new ResponseEntity<>(message, headers, HttpStatus.CREATED);
    }

    @GetMapping("/check")
    public ResponseEntity<Message> idCheck(@RequestParam(value = "id") String id) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", StandardCharsets.UTF_8));
        Message message = new Message();
        String userId = id;
        Optional<UserProfile> userOptional = userProfileService.getUserProfileByUserId(userId);
        if(userOptional.isPresent()) {
            message.setStatus(StatusEnum.CONFLICT);
            message.setMessage("USER ID ALREADY EXIST");
            return new ResponseEntity<>(message, headers, HttpStatus.CONFLICT);
        }
        message.setStatus(StatusEnum.OK);
        message.setMessage("USER ID AVAILABLE");
        return new ResponseEntity<>(message, headers, HttpStatus.OK);
    }

    @PostMapping("/signin")
    public ResponseEntity<Message> signIn(@RequestBody(required = true)UserSignInPostReq signInInfo) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", StandardCharsets.UTF_8));
        Message message = new Message();

        String id = signInInfo.getId();
        String password = signInInfo.getPassword();

        Optional<UserAuth> userAuthOptional = userAuthService.getUserAuthByUserId(id);
        if(!userAuthOptional.isPresent()) {
            message.setStatus(StatusEnum.Unauthorized);
            message.setMessage("Wrong User Id");
            return new ResponseEntity<>(message, headers, HttpStatus.UNAUTHORIZED);
        }
        if(passwordEncoder.matches(password, userAuthOptional.get().getPassword())) {
            UserProfile userProfile = userProfileService.getUserProfileByUserId(id).get();
            String nickname = userProfile.getNickname();
            List<String> data = new ArrayList<>();
            data.add(nickname);
            data.add(JwtTokenUtil.getToken(id));
            message.setStatus(StatusEnum.OK);
            message.setMessage("Sign In Success");
            message.setData(data);
            return new ResponseEntity<>(message, headers, HttpStatus.OK);
        } else {
            message.setStatus(StatusEnum.Unauthorized);
            message.setMessage("Wrong Password");
            return new ResponseEntity<>(message, headers, HttpStatus.UNAUTHORIZED);
        }
    }

    @GetMapping("/getidfromjwt")
    public ResponseEntity<String> getIdFromJwt(Authentication authentication) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", StandardCharsets.UTF_8));
        SsafyUserDetails userDetails = (SsafyUserDetails)authentication.getDetails();
        String userId = userDetails.getUsername();
        if(userId == null)
            return new ResponseEntity<>(null, headers, HttpStatus.UNAUTHORIZED);
        else
            return new ResponseEntity<>(userId, headers, HttpStatus.OK);
    }

    @GetMapping("/getpkfromjwt")
    public ResponseEntity<String> getPKFromJwt(Authentication authentication) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", StandardCharsets.UTF_8));
        SsafyUserDetails userDetails = (SsafyUserDetails)authentication.getDetails();
        String userId = userDetails.getUsername();
        String PK = userAuthService.getUserAuthByUserId(userId).get().getId();
        if(userId == null)
            return new ResponseEntity<>(null, headers, HttpStatus.UNAUTHORIZED);
        else
            return new ResponseEntity<>(PK, headers, HttpStatus.OK);
    }

    @GetMapping("/getprofile")
    public ResponseEntity<UserProfile> getProfile(Authentication authentication) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", StandardCharsets.UTF_8));
        SsafyUserDetails userDetails = (SsafyUserDetails)authentication.getDetails();
        String userId = userDetails.getUsername();
        if(userId == null)
            return new ResponseEntity<>(null, headers, HttpStatus.UNAUTHORIZED);
        else
            return new ResponseEntity<>(userProfileService.getUserProfileByUserId(userId).get(), headers, HttpStatus.OK);
    }
}

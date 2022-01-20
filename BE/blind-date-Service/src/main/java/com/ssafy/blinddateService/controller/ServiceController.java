package com.ssafy.blinddateService.controller;

import com.ssafy.blinddateService.vo.request.MatchStartPostReq;
import com.ssafy.blinddateService.vo.response.Message;
import com.ssafy.blinddateService.vo.response.StatusEnum;
import com.ssafy.blinddateService.vo.service.MatchingUser;
import com.ssafy.blinddateService.vo.service.UserProfile;
import com.ssafy.blinddateService.vo.service.VideoChat;
import org.json.HTTP;
import org.json.JSONObject;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import java.nio.charset.StandardCharsets;
import java.util.*;

@RestController
@RequestMapping("/api-boot/service")
public class ServiceController {

    List<MatchingUser> waitingMale = new LinkedList<>();
    List<MatchingUser> waitingFemale = new LinkedList<>();
    Map<String, Boolean> matchCheck = new HashMap<>();
    Map<String, MatchingUser> matchedUser = new HashMap<>();
    Map<String, Boolean> decideCheck = new HashMap<>();
    Map<String, VideoChat> room = new HashMap<>();

    @PostMapping("/match/start")
    public ResponseEntity<Message> startMatching(@RequestHeader HttpHeaders headers,
                                          @RequestBody(required = true) MatchStartPostReq matchStartPostReq) {
        System.out.println("MaleList size : " + waitingMale.size());
        System.out.println("FemaleList size : " + waitingFemale.size());

        JSONObject jsonObj = new JSONObject(headers);
        String authorization = jsonObj.get("authorization").toString();
        authorization = authorization.substring(authorization.indexOf("Bearer "), authorization.length() - 2);
        headers = new HttpHeaders();
        headers.set("Authorization", authorization);
        headers.setContentType(new MediaType("application", "json", StandardCharsets.UTF_8));
        HttpEntity requestEntity = new HttpEntity(headers);
        String serverUrl = "http://localhost:8081/api/auth/getprofile";
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<UserProfile> response = restTemplate.exchange(serverUrl, HttpMethod.GET, requestEntity, UserProfile.class);
        UserProfile user = response.getBody();
        MatchingUser matchingUser = MatchingUser.builder()
                .id(user.getId())
                .nickname(user.getNickname())
                .gender(user.getGender())
                .animal(user.getAnimal())
                .animals(matchStartPostReq.getAnimals())
                .humor(user.getHumorous())
                .likeability(user.getLikeability())
                .manner(user.getManner())
                .animal_accuracy(user.getAnimal_accuracy())
                .keyword1(user.getIntroduction_keyword1())
                .keyword2(user.getIntroduction_keyword2())
                .keyword3(user.getIntroduction_keyword3())
                .keyword4(user.getIntroduction_keyword4())
                .keyword5(user.getIntroduction_keyword5())
                .build();

        Message message = new Message();
        if(user.getGender().equals("male")) {
            if (!waitingFemale.isEmpty()) {
                for (MatchingUser female : waitingFemale) {
                    String animal = female.getAnimal();
                    if (matchStartPostReq.getAnimals().contains(animal) && female.getAnimals().contains(user.getAnimal()) && !matchCheck.get(female.getId())) {  // 매칭 성공
                        matchCheck.put(female.getId(), true);
                        matchedUser.put(female.getId(), matchingUser);
                        matchedUser.put(user.getId(), female);
                        waitingFemale.remove(female);
                        message.setStatus(StatusEnum.OK);
                        message.setMessage("Matching Success");
                        message.setData(female);
                        return new ResponseEntity<>(message, headers, HttpStatus.OK);
                    }
                }
            }
            waitingMale.add(matchingUser);
        }
        else {
            if (!waitingMale.isEmpty()) {
                for (MatchingUser male : waitingMale) {
                    String animal = male.getAnimal();
                    System.out.println("animal : " + animal);
                    System.out.println(matchStartPostReq);
                    System.out.println(matchStartPostReq.getAnimals().contains(animal));
                    System.out.println(user.getAnimal());
                    System.out.println(male.getAnimals().contains(user.getAnimal()));
                    System.out.println(male.getId());
                    matchCheck.get(male.getId());
                    if (matchStartPostReq
                            .getAnimals()
                            .contains(animal) &&
                            male.getAnimals()
                                    .contains(user.getAnimal())
                            && !matchCheck.get(
                                    male.getId())) {  // 매칭 성공
                        matchCheck.put(male.getId(), true);
                        matchedUser.put(male.getId(), matchingUser);
                        matchedUser.put(user.getId(), male);
                        waitingFemale.remove(male);
                        message.setStatus(StatusEnum.CREATED);
                        message.setMessage("Matching Success");
                        message.setData(male);
                        return new ResponseEntity<>(message, headers, HttpStatus.CREATED);
                    }
                }
            }
            waitingFemale.add(matchingUser);
        }
        matchCheck.put(user.getId(), false);
        System.out.println(matchingUser);

        message.setStatus(StatusEnum.CREATED);
        message.setMessage("Matching Start");
        return new ResponseEntity<>(message, headers, HttpStatus.CREATED);
    }

    @PostMapping("/match/stop")
    public ResponseEntity<Message> stopMatching(@RequestHeader HttpHeaders headers) {
        JSONObject jsonObj = new JSONObject(headers);
        String authorization = jsonObj.get("authorization").toString();
        authorization = authorization.substring(authorization.indexOf("Bearer "), authorization.length() - 2);
        headers = new HttpHeaders();
        headers.set("Authorization", authorization);
        headers.setContentType(new MediaType("application", "json", StandardCharsets.UTF_8));
        HttpEntity requestEntity = new HttpEntity(headers);
        String serverUrl = "http://localhost:8081/api/auth/getprofile";
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<UserProfile> response = restTemplate.exchange(serverUrl, HttpMethod.GET, requestEntity, UserProfile.class);
        UserProfile user = response.getBody();
        System.out.println("user pk : " + user.getId());
        if(user.getGender().equals("male")) {
            for(MatchingUser matchingUser : waitingMale) {
                System.out.println(matchingUser.getId());
                if(matchingUser.getId().equals(user.getId())) {
                    System.out.println("inside");
                    waitingMale.remove(matchingUser);
                    break;
                }
            }
        } else {
            for(MatchingUser matchingUser : waitingFemale) {
                if(matchingUser.getId().equals(user.getId())) {
                    waitingFemale.remove(matchingUser);
                    break;
                }
            }
        }
        matchCheck.remove(user.getId());
        matchedUser.remove(user.getId());
        decideCheck.remove(user.getId());
        room.remove(user.getId());
        Message message = new Message();
        message.setStatus(StatusEnum.OK);
        message.setMessage("Matching STOP");
        return new ResponseEntity<>(message, headers, HttpStatus.OK);
    }

    @PostMapping("/match/ask")
    public ResponseEntity<Message> askMatching(@RequestHeader HttpHeaders headers) {
        JSONObject jsonObj = new JSONObject(headers);
        String authorization = jsonObj.get("authorization").toString();
        authorization = authorization.substring(authorization.indexOf("Bearer "), authorization.length() - 2);
        headers = new HttpHeaders();
        headers.set("Authorization", authorization);
        headers.setContentType(new MediaType("application", "json", StandardCharsets.UTF_8));
        HttpEntity requestEntity = new HttpEntity(headers);
        String serverUrl = "http://localhost:8081/api/auth/getprofile";
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<UserProfile> response = restTemplate.exchange(serverUrl, HttpMethod.GET, requestEntity, UserProfile.class);
        UserProfile user = response.getBody();
        Message message = new Message();
        if(matchCheck.containsKey(user.getId())) {
            if(matchCheck.get(user.getId())) {
                message.setStatus(StatusEnum.CREATED);
                message.setMessage("Matching SUCCESS");
                message.setData(matchedUser.get(user.getId()));
                matchCheck.remove(user.getId());
            } else {
                message.setStatus(StatusEnum.OK);
                message.setMessage("Matching");
            }
        } else {
            message.setStatus(StatusEnum.OK);
            message.setMessage("Matching");
        }
        return new ResponseEntity<>(message, headers, HttpStatus.OK);
    }

    @PostMapping("/match/decide/{decide}")  // true or false
    public ResponseEntity<Message> decideMatching(@RequestHeader HttpHeaders headers, @PathVariable("decide") String decide) {
        JSONObject jsonObj = new JSONObject(headers);
        String authorization = jsonObj.get("authorization").toString();
        authorization = authorization.substring(authorization.indexOf("Bearer "), authorization.length() - 2);
        headers = new HttpHeaders();
        headers.set("Authorization", authorization);
        headers.setContentType(new MediaType("application", "json", StandardCharsets.UTF_8));
        HttpEntity requestEntity = new HttpEntity(headers);
        String serverUrl = "http://localhost:8081/api/auth/getprofile";
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<UserProfile> response = restTemplate.exchange(serverUrl, HttpMethod.GET, requestEntity, UserProfile.class);
        UserProfile user = response.getBody();

        Message message = new Message();
        if(decide.equals("true")) {
            decideCheck.put(user.getId(), true);
            message.setStatus(StatusEnum.OK);
            message.setMessage("TRUE SUCCESS");
        }
        else if (decide.equals("false")){
            decideCheck.put(user.getId(), false);
            message.setStatus(StatusEnum.OK);
            message.setMessage("FALSE SUCCESS");
        } else if(decide.equals("cancel")) {
            decideCheck.remove(user.getId());
            message.setStatus(StatusEnum.OK);
            message.setMessage("CANCEL SUCCESS");
        }
        return new ResponseEntity<>(message, headers, HttpStatus.OK);
    }

    @PostMapping("/match/askdecide")
    public ResponseEntity<Message> askDecide(@RequestHeader HttpHeaders headers) {
        JSONObject jsonObj = new JSONObject(headers);
        String authorization = jsonObj.get("authorization").toString();
        authorization = authorization.substring(authorization.indexOf("Bearer "), authorization.length() - 2);
        headers = new HttpHeaders();
        headers.set("Authorization", authorization);
        headers.setContentType(new MediaType("application", "json", StandardCharsets.UTF_8));
        HttpEntity requestEntity = new HttpEntity(headers);
        String serverUrl = "http://localhost:8081/api/auth/getprofile";
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<UserProfile> response = restTemplate.exchange(serverUrl, HttpMethod.GET, requestEntity, UserProfile.class);
        UserProfile user = response.getBody();
        String matchedUserId = matchedUser.get(user.getId()).getId();

        Message message = new Message();
        if(decideCheck.keySet().contains(matchedUserId)) {
            if(decideCheck.get(matchedUserId) == true) {
                VideoChat videoChat;
                if(room.containsKey(user.getId())) {
                    videoChat = room.get(user.getId());
                    room.remove(user.getId());
                } else {
                    // PK 생성
                    Random rand = new Random();
                    StringBuffer buf;
                    buf = new StringBuffer("V");
                    // 10개의 난수 생성
                    for(int i = 0; i < 10; i++)
                        buf.append(rand.nextInt(10));
                    // 소문자 알파벳 2개를 랜덤 위치에 삽입
                    for(int i = 0; i < 2; i++)
                        buf.insert(rand.nextInt(buf.length() - 1) + 1, (char)((rand.nextInt(26)) + 97));
                    videoChat = VideoChat.builder().id(buf.toString()).build();
                    room.put(matchedUserId, videoChat);
                }
                message.setMessage("SUCCESS");
                message.setStatus(StatusEnum.CREATED);
                message.setData(videoChat);
                decideCheck.remove(matchedUserId);
                matchedUser.remove(user.getId());
                return new ResponseEntity<>(message, headers, HttpStatus.CREATED);
            } else {
                message.setMessage("FAILED");
                message.setStatus(StatusEnum.OK);
                decideCheck.remove(matchedUserId);
                matchedUser.remove(user.getId());
                return new ResponseEntity<>(message, headers, HttpStatus.OK);
            }
        }
        else {
            message.setMessage("WAITING");
            message.setStatus(StatusEnum.OK);
            return new ResponseEntity<>(message, headers, HttpStatus.OK);
        }
    }
}

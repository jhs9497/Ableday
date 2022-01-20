package com.ssafy.blinddateAPI.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.blinddateAPI.vo.request.UserFriendPostReq;
import com.ssafy.blinddateAPI.vo.response.FriendGetRes;
import com.ssafy.blinddateAPI.vo.response.Message;
import com.ssafy.blinddateAPI.vo.response.StatusEnum;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api-boot/friend")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class FriendController {

    @PostMapping("")
    public ResponseEntity<Message> addFriend(@RequestHeader HttpHeaders headers,
                                             @RequestBody(required = true) UserFriendPostReq userFriendPostReq) {
        // JWT 파싱
        JSONObject jsonObj = new JSONObject(headers);
        String authorization = jsonObj.get("authorization").toString();
        authorization = authorization.substring(authorization.indexOf("Bearer "), authorization.length() - 2);

        String requestURL = "http://localhost:8081/api/friend";
        RestTemplate restTemplate = new RestTemplate();
        headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", StandardCharsets.UTF_8));
        headers.set("Authorization", authorization);

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(requestURL);
        UriComponents uriComponents = builder.build();

        HttpEntity<UserFriendPostReq> requestEntity = new HttpEntity<>(userFriendPostReq, headers);

        ResponseEntity<String> response = null;
        Message message = new Message();
        try {
            response = restTemplate.exchange(uriComponents.toUriString(), HttpMethod.POST, requestEntity, String.class);
            message.setStatus(StatusEnum.OK);
            jsonObj = new JSONObject(response.getBody());
            message.setMessage(jsonObj.getString("message"));
            return new ResponseEntity<>(message, headers, HttpStatus.OK);
        } catch (HttpClientErrorException e) {
            jsonObj = new JSONObject(e.getResponseBodyAsString());
            message.setStatus(StatusEnum.CONFLICT);
            message.setMessage(jsonObj.getString("message"));
            return new ResponseEntity<>(message, headers, HttpStatus.CONFLICT);
        }
    }

    @GetMapping("")
    public ResponseEntity<Message> getFriend(@RequestHeader HttpHeaders headers) {
        // JWT 파싱
        JSONObject jsonObj = new JSONObject(headers);
        String authorization = jsonObj.get("authorization").toString();
        authorization = authorization.substring(authorization.indexOf("Bearer "), authorization.length() - 2);

        String requestURL = "http://localhost:8081/api/friend";
        RestTemplate restTemplate = new RestTemplate();
        headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", StandardCharsets.UTF_8));
        headers.set("Authorization", authorization);

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(requestURL);
        UriComponents uriComponents = builder.build();

        HttpEntity requestEntity = new HttpEntity(headers);

        ResponseEntity<String> response = null;
        Message message = new Message();
        try {
            response = restTemplate.exchange(uriComponents.toUriString(), HttpMethod.GET, requestEntity, String.class);
            message.setStatus(StatusEnum.OK);
            jsonObj = new JSONObject(response.getBody());
            message.setMessage(jsonObj.getString("message"));
            List<FriendGetRes> listData = new ArrayList<>();
            JSONArray data = (JSONArray) jsonObj.get("data");
            if(data != null) {
                for(int i = 0; i < data.length(); i++) {
                    JSONObject tmp = (JSONObject) data.get(i);
                    FriendGetRes friendGetRes = FriendGetRes.builder()
                            .id(tmp.getString("id"))
                            .nickname(tmp.getString("nickname"))
                            .gender(tmp.getString("gender"))
                            .build();
                    if(!tmp.get("animal").toString().equals("null"))
                        friendGetRes.setAnimal(tmp.getString("animal"));
                    if(!tmp.get("keyword1").toString().equals("null"))
                        friendGetRes.setKeyword1(tmp.getString("keyword1"));
                    if(!tmp.get("keyword2").toString().equals("null"))
                        friendGetRes.setKeyword2(tmp.getString("keyword2"));
                    if(!tmp.get("keyword3").toString().equals("null"))
                        friendGetRes.setKeyword3(tmp.getString("keyword3"));
                    if(!tmp.get("keyword4").toString().equals("null"))
                        friendGetRes.setKeyword4(tmp.getString("keyword4"));
                    if(!tmp.get("keyword5").toString().equals("null"))
                        friendGetRes.setKeyword5(tmp.getString("keyword5"));
                    listData.add(friendGetRes);
                }
            }
            message.setData(listData);
            return new ResponseEntity<>(message, headers, HttpStatus.OK);
        } catch (HttpClientErrorException e) {
            jsonObj = new JSONObject(e.getResponseBodyAsString());
            message.setStatus(StatusEnum.CONFLICT);
            message.setMessage(jsonObj.getString("message"));
            return new ResponseEntity<>(message, headers, HttpStatus.CONFLICT);
        }
    }

    @DeleteMapping("")
    public ResponseEntity<Message> deleteFriend(@RequestHeader HttpHeaders headers,
                                             @RequestBody(required = true) UserFriendPostReq userFriendPostReq) {
        // JWT 파싱
        JSONObject jsonObj = new JSONObject(headers);
        String authorization = jsonObj.get("authorization").toString();
        authorization = authorization.substring(authorization.indexOf("Bearer "), authorization.length() - 2);

        String requestURL = "http://localhost:8081/api/friend";
        RestTemplate restTemplate = new RestTemplate();
        headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", StandardCharsets.UTF_8));
        headers.set("Authorization", authorization);

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(requestURL);
        UriComponents uriComponents = builder.build();

        HttpEntity<UserFriendPostReq> requestEntity = new HttpEntity<>(userFriendPostReq, headers);

        ResponseEntity<String> response = null;
        Message message = new Message();
        try {
            response = restTemplate.exchange(uriComponents.toUriString(), HttpMethod.DELETE, requestEntity, String.class);
            message.setStatus(StatusEnum.OK);
            jsonObj = new JSONObject(response.getBody());
            message.setMessage(jsonObj.getString("message"));
            return new ResponseEntity<>(message, headers, HttpStatus.OK);
        } catch (HttpClientErrorException e) {
            jsonObj = new JSONObject(e.getResponseBodyAsString());
            message.setStatus(StatusEnum.BAD_REQUEST);
            message.setMessage(jsonObj.getString("message"));
            return new ResponseEntity<>(message, headers, HttpStatus.BAD_REQUEST);
        }
    }
}

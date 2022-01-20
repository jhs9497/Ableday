package com.ssafy.blinddateAPI.controller;

import com.ssafy.blinddateAPI.vo.request.MatchStartPostReq;
import com.ssafy.blinddateAPI.vo.response.Message;
import com.ssafy.blinddateAPI.vo.response.StatusEnum;
import org.json.JSONObject;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api-boot/service")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ServiceController {
//    @PostMapping("/match/start")
//    public ResponseEntity<Message> startMatching(@RequestHeader HttpHeaders headers,
//                                             @RequestBody(required = true) MatchStartPostReq matchStartPostReq) {
//        // JWT 파싱
//        JSONObject jsonObj = new JSONObject(headers);
//        String authorization = jsonObj.get("authorization").toString();
//        authorization = authorization.substring(authorization.indexOf("Bearer "), authorization.length() - 2);
//
//        String requestURL = "http://localhost:8082/api/service/match/start";
//        RestTemplate restTemplate = new RestTemplate();
//        headers = new HttpHeaders();
//        headers.setContentType(new MediaType("application", "json", StandardCharsets.UTF_8));
//        headers.set("Authorization", authorization);
//
//        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(requestURL);
//        UriComponents uriComponents = builder.build();
//
//        HttpEntity<MatchStartPostReq> requestEntity = new HttpEntity<>(matchStartPostReq, headers);
//
//        ResponseEntity<Message> response = null;
//        Message message = new Message();
//        try {
//            response = restTemplate.exchange(uriComponents.toUriString(), HttpMethod.POST, requestEntity, Message.class);
//            message.setStatus(StatusEnum.OK);
//            jsonObj = new JSONObject(response.getBody());
//            message.setMessage(jsonObj.getString("message"));
//            message.setData(jsonObj.get("data"));
//            return new ResponseEntity<>(message, headers, HttpStatus.OK);
//        } catch (HttpClientErrorException e) {
//            jsonObj = new JSONObject(e.getResponseBodyAsString());
//            message.setStatus(StatusEnum.BAD_REQUEST);
//            message.setMessage(jsonObj.getString("message"));
//            return new ResponseEntity<>(message, headers, HttpStatus.BAD_REQUEST);
//        }
//    }
//
//    @PostMapping("/match/ask")
//    public ResponseEntity<Message> askMatching(@RequestHeader HttpHeaders headers) {
//        // JWT 파싱
//        JSONObject jsonObj = new JSONObject(headers);
//        String authorization = jsonObj.get("authorization").toString();
//        authorization = authorization.substring(authorization.indexOf("Bearer "), authorization.length() - 2);
//
//        String requestURL = "http://localhost:8082/api/service/match/start";
//        RestTemplate restTemplate = new RestTemplate();
//        headers = new HttpHeaders();
//        headers.setContentType(new MediaType("application", "json", StandardCharsets.UTF_8));
//        headers.set("Authorization", authorization);
//
//        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(requestURL);
//        UriComponents uriComponents = builder.build();
//
//        HttpEntity<String> requestEntity = new HttpEntity<>(headers);
//
//        ResponseEntity<String> response = null;
//        Message message = new Message();
//        try {
//            response = restTemplate.exchange(uriComponents.toUriString(), HttpMethod.POST, requestEntity, String.class);
//            message.setStatus(StatusEnum.OK);
//            jsonObj = new JSONObject(response.getBody());
//            message.setMessage(jsonObj.getString("message"));
//            message.setData(jsonObj.get("data"));
//            return new ResponseEntity<>(message, headers, HttpStatus.OK);
//        } catch (HttpClientErrorException e) {
//            jsonObj = new JSONObject(e.getResponseBodyAsString());
//            message.setStatus(StatusEnum.BAD_REQUEST);
//            message.setMessage(jsonObj.getString("message"));
//            return new ResponseEntity<>(message, headers, HttpStatus.BAD_REQUEST);
//        }
//    }
}

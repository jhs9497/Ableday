package com.ssafy.blinddateAPI.controller;

import com.ssafy.blinddateAPI.vo.response.Message;
import com.ssafy.blinddateAPI.vo.response.MyPageRes;
import com.ssafy.blinddateAPI.vo.response.StatusEnum;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClientBuilder;

import org.apache.http.util.EntityUtils;
import org.json.JSONObject;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;
import java.util.Set;


@RestController
@RequestMapping("/api-boot/user")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AuthController {

    @GetMapping("/check")
    public ResponseEntity<String> idCheck(@RequestParam(value = "id", defaultValue = "") String id) {
        String requestURL = "http://localhost:8081/api/auth/check";
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", StandardCharsets.UTF_8));

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(requestURL)
                .queryParam("id", id);

        UriComponents uriComponents = builder.build();
        ResponseEntity<String> response = null;
        try {
             response = restTemplate.exchange(uriComponents.toUriString(), HttpMethod.GET, new org.springframework.http.HttpEntity<String>(headers), String.class);
        } catch (HttpClientErrorException e) {
            return new ResponseEntity<>(e.getResponseBodyAsString(), headers, e.getStatusCode());
        }
        return new ResponseEntity<>(response.getBody(), headers, HttpStatus.OK);
    }

    @GetMapping("/{path}")
    public ResponseEntity<Message> getController(Map<String, Object> data, @PathVariable("path") String path) {
        String requestURL = "http://localhost:8081/api/auth/" + path;

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", StandardCharsets.UTF_8));

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(requestURL);
        for(String key : data.keySet())
            builder.queryParam(key, data.get(key));
        UriComponents uriComponents = builder.build();
        Message message = new Message();
        ResponseEntity<String> response = null;
        try {
            response = restTemplate.exchange(uriComponents.toUriString(), HttpMethod.GET, new org.springframework.http.HttpEntity<String>(headers), String.class);
            message.setStatus(StatusEnum.OK);
        } catch (HttpClientErrorException e) {
            message.setStatus(StatusEnum.CONFLICT);
        }
        int statusCode = response.getStatusCodeValue();
        message.setMessage(response.getBody());
        return ResponseEntity.status(statusCode).body(message);
    }

    @PostMapping("/{path}")
    public ResponseEntity<Message> postController(@RequestBody(required = true) Map<String, Object> data,
                                                  @PathVariable("path") String path) {
        Set keySet = data.keySet();
        Object[] keyArr = keySet.toArray();
        JSONObject jsonObj = new JSONObject();
        for(Object key: keyArr) jsonObj.put((String)key, data.get((String) key));
        String requestURL = "http://localhost:8081/api/auth/" + path;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", StandardCharsets.UTF_8));

        HttpClient client = HttpClientBuilder.create().build();
        HttpPost postRequest = new HttpPost(requestURL);
        StringEntity entity = new StringEntity(jsonObj.toString(), StandardCharsets.UTF_8);
        entity.setContentType("application/json");
        postRequest.setEntity(entity);

        HttpResponse response = null;
        try {
            response = client.execute(postRequest);
        } catch (IOException e) {
            e.printStackTrace();
        }
        HttpEntity respEntity = response.getEntity();
        String content = null;
        try {
            content = EntityUtils.toString(respEntity);
        } catch (IOException e) {
            e.printStackTrace();
        }
        System.out.println(content);
        jsonObj = new JSONObject(content);
        int statusCode = response.getStatusLine().getStatusCode();
        Message message = new Message();
        message.setStatus(StatusEnum.valueOf(jsonObj.getString("status")));
        message.setMessage(jsonObj.getString("message"));
        if(!jsonObj.isNull("data"))
            message.setData(jsonObj.get("data"));
        return ResponseEntity.status(statusCode).body(message);
    }
}
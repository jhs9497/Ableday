package com.ssafy.blinddateAPI.controller;

import com.ssafy.blinddateAPI.vo.request.MyPagePutReq;
import com.ssafy.blinddateAPI.vo.request.UserReivewPostReq;
import com.ssafy.blinddateAPI.vo.response.Message;
import com.ssafy.blinddateAPI.vo.response.MyPageRes;
import com.ssafy.blinddateAPI.vo.response.StatusEnum;
import org.apache.commons.io.IOUtils;
import org.json.JSONObject;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import javax.swing.filechooser.FileSystemView;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;

@RestController
@RequestMapping("/api-boot/profile")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ProfileController {

    @PostMapping("/image")
    public ResponseEntity<Message> imageUpload(@RequestHeader HttpHeaders headers,
                                               @RequestPart MultipartFile file) throws IOException {
        JSONObject jsonObj = new JSONObject(headers);
        String authorization = jsonObj.get("authorization").toString();
        authorization = authorization.substring(authorization.indexOf("Bearer "), authorization.length() - 2);
        headers = new HttpHeaders();
        headers.set("Authorization", authorization);
        headers.setContentType(new MediaType("application", "json", StandardCharsets.UTF_8));
        HttpEntity requestEntity = new HttpEntity(headers);
        String serverUrl = "http://localhost:8081/api/auth/getpkfromjwt";
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.exchange(serverUrl, HttpMethod.GET, requestEntity, String.class);
        String userId = response.getBody();

        String path = FileSystemView.getFileSystemView().getHomeDirectory().toString() + "/images/" + userId;
        File dir = new File(path);
        if(!dir.exists()) {
            try {
                dir.mkdir();
            } catch (Exception e) {
                e.getStackTrace();
            }
        }
        long time = System.currentTimeMillis();
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMddhhmmss");
        String filePath = path + "/" + simpleDateFormat.format(time) + file.getOriginalFilename();
        File dest = new File(filePath);
        file.transferTo(dest);

        serverUrl = "http://localhost:8081/api/profile/image";
        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add("path", filePath);

        HttpEntity<?> httpEntity = new HttpEntity<Object>(map, headers);
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(serverUrl);
        UriComponents uriComponents = builder.build();

        ResponseEntity<String> resEntity = null;
        Message message = new Message();
        try {
            resEntity = restTemplate.exchange(uriComponents.toUriString(), HttpMethod.POST, httpEntity, String.class);
            message.setStatus(StatusEnum.OK);
            jsonObj = new JSONObject(resEntity.getBody());
            message.setMessage(jsonObj.getString("message"));
            return new ResponseEntity<>(message, headers, HttpStatus.OK);
        } catch (HttpClientErrorException e) {
            message.setStatus(StatusEnum.CONFLICT);
            message.setMessage(e.getResponseBodyAsString());
            return new ResponseEntity<>(message, headers, HttpStatus.CONFLICT);
        }
    }

    @GetMapping(value = "/image/{id}", produces = MediaType.IMAGE_JPEG_VALUE)
    public ResponseEntity<byte[]> userSearch(@PathVariable("id") String id) throws IOException {
        String path = FileSystemView.getFileSystemView().getHomeDirectory().toString() + "/images/" + id;
        File file = new File(path);
        byte[] imageByteArray = {};
        if(file.list() == null || file.list().length == 0) {
            return new ResponseEntity<>(imageByteArray, HttpStatus.OK);
        }
        File recent = new File(path + "/" + file.list()[0]);
        String image = recent.getAbsolutePath();
        for(String name : file.list()) {
            System.out.println(name);
            File tmp = new File(path + "/" + name);
            if(tmp.lastModified() > recent.lastModified())
                image = tmp.getAbsolutePath();
        }

        System.out.println(image);

        InputStream imageStream = new FileInputStream(image);
        imageByteArray = IOUtils.toByteArray(imageStream);
        imageStream.close();

        return new ResponseEntity<>(imageByteArray, HttpStatus.OK);
    }


    @GetMapping("/mypage")
    public ResponseEntity<Message> myPage(@RequestHeader HttpHeaders headers) {
        JSONObject jsonObj = new JSONObject(headers);
        String authorization = jsonObj.get("authorization").toString();
        authorization = authorization.substring(authorization.indexOf("Bearer "), authorization.length() - 2);

        String requestURL = "http://localhost:8081/api/profile/mypage";
        RestTemplate restTemplate = new RestTemplate();
        headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", StandardCharsets.UTF_8));
        headers.set("Authorization", authorization);

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(requestURL);
        UriComponents uriComponents = builder.build();

        ResponseEntity<String> response = null;
        Message message = new Message();
        try {
            response = restTemplate.exchange(uriComponents.toUriString(), HttpMethod.GET, new org.springframework.http.HttpEntity<String>(headers), String.class);
            message.setStatus(StatusEnum.OK);
            jsonObj = new JSONObject(response.getBody());
            message.setMessage(jsonObj.getString("message"));
            JSONObject data = (JSONObject) jsonObj.get("data");
            MyPageRes myPageRes = MyPageRes.builder()
                    .id(data.getString("id"))
                    .nickname(data.getString("nickname"))
                    .gender(data.getString("gender"))
                    .birthday(data.getString("birthday"))
                    .manner(data.get("manner").toString())
                    .humorous(data.get("humorous").toString())
                    .likeability(data.get("likeability").toString())
                    .animal_accuracy(data.get("animal_accuracy").toString())
                    .ban(data.get("ban").toString())
                    .reviewCount(data.get("reviewCount").toString())
                    .build();
            if(!data.get("animal").toString().equals("null"))
                myPageRes.setAnimal(data.getString("animal"));
            if(!data.get("introduction_keyword1").toString().equals("null"))
                myPageRes.setIntroduction_keyword1(data.getString("introduction_keyword1"));
            if(!data.get("introduction_keyword2").toString().equals("null"))
                myPageRes.setIntroduction_keyword2(data.getString("introduction_keyword2"));
            if(!data.get("introduction_keyword3").toString().equals("null"))
                myPageRes.setIntroduction_keyword3(data.getString("introduction_keyword3"));
            if(!data.get("introduction_keyword4").toString().equals("null"))
                myPageRes.setIntroduction_keyword4(data.getString("introduction_keyword4"));
            if(!data.get("introduction_keyword5").toString().equals("null"))
                myPageRes.setIntroduction_keyword5(data.getString("introduction_keyword5"));

            message.setData(myPageRes);
            return new ResponseEntity<>(message, headers, HttpStatus.OK);
        } catch (HttpClientErrorException e) {
            jsonObj = new JSONObject(e.getResponseBodyAsString());
            message.setStatus(StatusEnum.BAD_REQUEST);
            message.setMessage(jsonObj.getString("message"));
            return new ResponseEntity<>(message, headers, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/mypage")
    public ResponseEntity<Message> myPage(@RequestHeader HttpHeaders headers,
                                          @RequestBody(required = true)MyPagePutReq myPagePutReq) {
        // JWT 파싱
        JSONObject jsonObj = new JSONObject(headers);
        String authorization = jsonObj.get("authorization").toString();
        authorization = authorization.substring(authorization.indexOf("Bearer "), authorization.length() - 2);

        String requestURL = "http://localhost:8081/api/profile/mypage";
        RestTemplate restTemplate = new RestTemplate();
        headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", StandardCharsets.UTF_8));
        headers.set("Authorization", authorization);

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(requestURL);
        UriComponents uriComponents = builder.build();

        HttpEntity<MyPagePutReq> requestEntity = new HttpEntity<>(myPagePutReq, headers);

        ResponseEntity<String> response = null;
        Message message = new Message();
        try {
            response = restTemplate.exchange(uriComponents.toUriString(), HttpMethod.PUT, requestEntity, String.class);
            message.setStatus(StatusEnum.OK);
            jsonObj = new JSONObject(response.getBody());
            message.setMessage(jsonObj.getString("message"));
            return new ResponseEntity<>(message, headers, HttpStatus.OK);
        } catch (HttpClientErrorException e) {
            e.printStackTrace();
            message.setStatus(StatusEnum.BAD_REQUEST);
            return new ResponseEntity<>(message, headers, HttpStatus.BAD_REQUEST);
        }
    }
    @PostMapping("/review")
    public ResponseEntity<Message> addFriend(@RequestHeader HttpHeaders headers,
                                             @RequestBody(required = true) UserReivewPostReq userReviewPostReq) {
        // JWT 파싱
        JSONObject jsonObj = new JSONObject(headers);
        String authorization = jsonObj.get("authorization").toString();
        authorization = authorization.substring(authorization.indexOf("Bearer "), authorization.length() - 2);

        String requestURL = "http://localhost:8081/api/profile/review";
        RestTemplate restTemplate = new RestTemplate();
        headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", StandardCharsets.UTF_8));
        headers.set("Authorization", authorization);

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(requestURL);
        UriComponents uriComponents = builder.build();

        HttpEntity<UserReivewPostReq> requestEntity = new HttpEntity<>(userReviewPostReq, headers);

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
            message.setStatus(StatusEnum.BAD_REQUEST);
            message.setMessage(jsonObj.getString("message"));
            return new ResponseEntity<>(message, headers, HttpStatus.BAD_REQUEST);
        }
    }
}

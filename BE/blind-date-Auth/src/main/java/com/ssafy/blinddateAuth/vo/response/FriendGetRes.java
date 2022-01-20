package com.ssafy.blinddateAuth.vo.response;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import lombok.Builder;

@Builder
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
public class FriendGetRes {
    String id;
    String nickname;
    String gender;
    String animal;
    String keyword1;
    String keyword2;
    String keyword3;
    String keyword4;
    String keyword5;
}

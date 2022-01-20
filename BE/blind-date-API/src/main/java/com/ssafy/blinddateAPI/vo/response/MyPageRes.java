package com.ssafy.blinddateAPI.vo.response;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import lombok.Builder;
import lombok.Setter;
import lombok.ToString;

@Setter
@Builder
@ToString
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
public class MyPageRes{
    private String id;
    private String nickname;
    private String gender;
    private String birthday;
    private String animal;
    private String manner;
    private String humorous;
    private String likeability;
    private String animal_accuracy;
    private String introduction_keyword1;
    private String introduction_keyword2;
    private String introduction_keyword3;
    private String introduction_keyword4;
    private String introduction_keyword5;
    private String ban;
    private String reviewCount;
}

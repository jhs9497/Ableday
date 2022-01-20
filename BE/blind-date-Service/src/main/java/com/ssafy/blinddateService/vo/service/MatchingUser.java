package com.ssafy.blinddateService.vo.service;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@Getter
@Builder
@ToString
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
public class MatchingUser {
    String id;
    String nickname;
    String animal;
    String gender;
    String keyword1;
    String keyword2;
    String keyword3;
    String keyword4;
    String keyword5;
    float manner;
    float humor;
    float likeability;
    float animal_accuracy;
    List<String> animals;
}

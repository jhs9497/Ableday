package com.ssafy.blinddateAuth.vo.request;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class UserReivewPostReq {
    private String id;
    private int manner;
    private int humorous;
    private int likeability;
    private int animal_accuracy;
}

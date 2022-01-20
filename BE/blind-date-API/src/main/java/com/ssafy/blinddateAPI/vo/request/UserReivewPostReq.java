package com.ssafy.blinddateAPI.vo.request;

import lombok.Getter;

@Getter
public class UserReivewPostReq {
    private String id;
    private int manner;
    private int humorous;
    private int likeability;
    private int animal_accuracy;
}

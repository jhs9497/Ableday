package com.ssafy.blinddateService.vo.request;

import lombok.Getter;
import lombok.ToString;

import java.util.List;

@Getter
@ToString
public class MatchStartPostReq {
    private List<String> animals;
}

package com.ssafy.blinddateAuth.vo.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;

@ToString
@NoArgsConstructor
@Getter
public class AnimalPostReq {
    private List<String> path;
}

package com.ssafy.blinddateAuth.vo.request;

import lombok.Getter;


@Getter
public class UserRegisterPostReq {
    String id;
    String password;
    String nickname;
    String gender;
    String birthday;
}

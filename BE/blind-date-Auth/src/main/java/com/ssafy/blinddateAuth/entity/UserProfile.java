package com.ssafy.blinddateAuth.entity;

import lombok.*;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import java.io.Serializable;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@Builder // 객체 생성 처리
@AllArgsConstructor // @Builder를 사용하기 위한 어노테이션
@NoArgsConstructor // @Builder를 사용하기 위한 어노테이션
@ToString
public class UserProfile implements Serializable {
    @Id //@Entity가 붙은 클래스는 pk필드를 @id로 지정해줘야한다.
    @Column(length = 13)
    private String id;
    private String nickname;
    private String gender;
    private LocalDate birthday;
    private String animal;
    @Builder.Default
    private Float manner = 0f;
    @Builder.Default
    private Float humorous = 0f;
    @Builder.Default
    private Float likeability = 0f;
    @Builder.Default
    private Float animal_accuracy = 0f;
    private String introduction_keyword1;
    private String introduction_keyword2;
    private String introduction_keyword3;
    private String introduction_keyword4;
    private String introduction_keyword5;
    @Builder.Default
    private Boolean ban = false;
    @Builder.Default
    private Integer reviewCount = 0;
}

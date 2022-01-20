package com.ssafy.blinddateAuth.entity;

import lombok.*;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
@Getter
@Setter
@Builder  // 객체 생성 처리
@AllArgsConstructor  // @Builder를 사용하기 위한 어노테이션
@NoArgsConstructor  // @Builder를 사용하기 위한 어노테이션
@ToString
public class UserFriend {
    @Id  // @Entity가 붙은 클래스는 pk필드를 @id로 지정해줘야한다.
    @Column(length = 13)
    private String id;
    private String userId1;
    private String userId2;

    @Override
    public String toString() {
        return this.userId2;
    }
}

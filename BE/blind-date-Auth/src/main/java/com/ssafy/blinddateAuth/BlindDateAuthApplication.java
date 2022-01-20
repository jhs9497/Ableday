package com.ssafy.blinddateAuth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class BlindDateAuthApplication {

	public static void main(String[] args) {
		SpringApplication.run(BlindDateAuthApplication.class, args);
	}

}

package com.example.backend.global.security;

import com.example.backend.user.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;

import java.security.Key;
import java.util.Base64;
import java.util.Collections;
import java.util.Date;

@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}") // application.yml에서 비밀 키 값을 가져온다.
    private String secretKey;

    @Value("${jwt.expiration-ms}") // application.yml에서 만료 시간 값을 가져온다.
    private long tokenValidityInMilliseconds;

    private Key key; // 비밀 키를 Key 객체로 변환하여 보관할 변수

    @PostConstruct // 의존성 주입이 완료된 후, 초기화를 위해 실행되는 메서드
    protected void init() {
        byte[] keyBytes = Base64.getDecoder().decode(secretKey); // 읽어온 secretKey를 Base64로 디코딩
        this.key = Keys.hmacShaKeyFor(keyBytes); // 디코딩 된 바이트 배열을 사용하여 Key 객체 생성
    }

    // "열쇠 발급" - 로그인 성공 시 토큰을 생성하는 메서드
    public String createToken(User user) {
        Claims claims = Jwts.claims().setSubject(user.getEmail());
        claims.put("nickname", user.getNickname());

        Date now = new Date();
        Date validity = new Date(now.getTime() + tokenValidityInMilliseconds); // 만료 시간 설정

        return Jwts.builder()
                .setClaims(claims) // 정보 담기
                .setIssuedAt(now)  // 토큰 발행 시간
                .setExpiration(validity) // 토큰 만료 시간
                .signWith(key, SignatureAlgorithm.HS256) // 사용할 암호화 알고리즘과 비밀 키
                .compact(); // 토큰 생성
    }

    // "열쇠 검증" - API 요청이 올 때마다 토큰이 유효한지 검사할 메서드
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true; // 유효기간 안 지남, 서명 일치 = 유효함
        } catch (Exception e) {
            // (예: MalformedJwtException, ExpiredJwtException, SignatureException 등)
            // 토큰이 유효하지 않으면 (기간 만료, 위조 등) false 반환
            return false;
        }
    }

    /**
     * "열쇠 정보 확인" - 토큰에서 사용자의 이메일(Subject)을 꺼내는 메서드
     */
    public String getUserEmail(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    /**
     * "인증 정보 조회" - 토큰으로부터 Spring Security가 이해할 수 있는 Authentication 객체를 반환
     */
    public Authentication getAuthentication(String token) {
        String email = getUserEmail(token);
        // (참고) 원래는 UserDetailsService를 통해 DB에서 UserDetails 객체를 가져와야 하지만,
        // 지금은 간단히 이메일과 빈 권한 목록으로 인증 객체를 만든다.
        return new UsernamePasswordAuthenticationToken(email, "", Collections.emptyList());
    }
}

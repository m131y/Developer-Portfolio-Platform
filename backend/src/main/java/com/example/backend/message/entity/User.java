//package com.example.backend.message.entity;
//
//import com.fasterxml.jackson.annotation.JsonIgnore;
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//import org.hibernate.annotations.CreationTimestamp;
//import org.hibernate.annotations.UpdateTimestamp;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.userdetails.UserDetails;
//
//import java.time.LocalDateTime;
//import java.util.Collection;
//import java.util.HashSet;
//import java.util.List;
//import java.util.Set;
//
//@Entity
//@Table(name = "users", indexes = {
//        @Index(name = "idx_username", columnList = "username"),
//        @Index(name = "idx_email", columnList = "email")
//})
//@Data
//@Builder
//@NoArgsConstructor
//@AllArgsConstructor
//public class User implements UserDetails {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(unique = true, nullable = false)
//    private String email;
//
//    @Column(nullable = false)
//    private String password;
//
//    @Column(unique = true, nullable = false)
//    private String nickname;
//
//    private String bio;
//
//    @Column(name = "profile_image_url", columnDefinition = "TEXT")
//    private String profileImageUrl;
//
//    @Enumerated(EnumType.STRING)
//    private AuthProvider provider;
//
//    private String providerId;
//
//    @CreationTimestamp
//    @Column(name = "created_at", updatable = false)
//    private LocalDateTime createdAt;
//
//    @UpdateTimestamp
//    @Column(name = "updated_at")
//    private LocalDateTime updatedAt;
////
////    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
////    @Builder.Default
////    private Set<Post> posts = new HashSet<>();
////
////    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
////    @Builder.Default
////    private Set<Comment> comments = new HashSet<>();
////
////    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
////    @Builder.Default
////    private Set<Like> likes = new HashSet<>();
//
//    @OneToMany(mappedBy = "sender", fetch = FetchType.LAZY)
//    @Builder.Default
//    private Set<Message> sentMessages = new HashSet<>();
//
//    @OneToMany(mappedBy = "creator", fetch = FetchType.LAZY)
//    @Builder.Default
//    @JsonIgnore
//    private Set<MessageRoom> createdRooms = new HashSet<>();
//
//    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
//    @Builder.Default
//    @JsonIgnore
//    private Set<RoomParticipant> roomParticipants = new HashSet<>();
//
//    private boolean enabled;
//
//    @PrePersist
//    protected void onCreate() { enabled = true; }
//
//    @Override
//    public Collection<? extends GrantedAuthority> getAuthorities() {
//        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
//    }
//
//    @Override
//    public boolean isEnabled() { return enabled; }
//}
package com.example.backend.user.repository;

import com.example.backend.user.entity.TechStack;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TechStackRepository extends JpaRepository<TechStack, Long> {

    Optional<TechStack> findByTechName(String techName);
}
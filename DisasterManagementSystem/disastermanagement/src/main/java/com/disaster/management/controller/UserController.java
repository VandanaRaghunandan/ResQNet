package com.disaster.management.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import com.disaster.management.repository.UserRepository;
import com.disaster.management.entity.User;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.List;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.http.ResponseEntity;
import jakarta.validation.Valid;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.disaster.management.dto.LoginRequest;
import com.disaster.management.security.JwtUtil;
import java.util.Map;
@RestController
public class UserController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    public UserController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }



    @GetMapping("/test")
    public String test() {
        return "Backend is working!";
    }
    @PostMapping("/add-user")
    public User addUser(@Valid @RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @DeleteMapping("/users/{id}")
    public String deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return "User deleted successfully";
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {

        return userRepository.findByEmail(loginRequest.getEmail())
                .map(user -> {

                    if (passwordEncoder.matches(
                            loginRequest.getPassword(),
                            user.getPassword()
                    )) {

                        String token = jwtUtil.generateToken(
                                user.getEmail(),
                                user.getRole()
                        );

                        return ResponseEntity.ok(
                                Map.of(
                                        "token", token,
                                        "role", user.getRole()
                                )
                        );

                    } else {

                        return ResponseEntity
                                .status(401)
                                .body("Invalid password");

                    }

                })
                .orElse(
                        ResponseEntity
                                .status(404)
                                .body("User not found")
                );
    }
}
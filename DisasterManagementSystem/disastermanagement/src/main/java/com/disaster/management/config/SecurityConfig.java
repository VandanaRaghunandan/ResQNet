
        package com.disaster.management.config;

import com.disaster.management.security.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {})

                .authorizeHttpRequests(auth -> auth

                        /* PUBLIC */
                        .requestMatchers("/ws/**").permitAll()
                        .requestMatchers("/ws").permitAll()
                        .requestMatchers("/uploads/**").permitAll()
                        .requestMatchers(
                                HttpMethod.POST,
                                "/login"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.POST,
                                "/add-user"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/disasters/stats"
                        ).permitAll()

                        /* USERS */

                        .requestMatchers(
                                "/users"
                        ).hasRole("ADMIN")

                        /* DISASTERS */

                        .requestMatchers(
                                HttpMethod.POST,
                                "/disasters"
                        ).hasRole("CITIZEN")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/disasters"
                        ).hasAnyRole(
                                "ADMIN",
                                "RESPONDER"
                        )

                        .requestMatchers(
                                HttpMethod.GET,
                                "/disasters/my"
                        ).hasRole("RESPONDER")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/disasters/*/assign"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/disasters/*/status"
                        ).hasRole("RESPONDER")

                        /* ALERTS */

                        .requestMatchers(
                                HttpMethod.POST,
                                "/alerts"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/alerts"
                        ).authenticated()

                        /* EVERYTHING ELSE */

                        .anyRequest().authenticated()

                )

                .addFilterBefore(
                        jwtFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();

    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.addAllowedOrigin(
                "http://localhost:3000"
        );

        configuration.addAllowedMethod("*");

        configuration.addAllowedHeader("*");

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }
}


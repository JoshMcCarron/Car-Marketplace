package com.lebronJamesCars.security;

import com.lebronJamesCars.entity.User;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("userSecurity")
public class UserSecurity {

    public boolean isOwner(Long userId, Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) return false;
        User principal = (User) auth.getPrincipal();
        return principal.getUserId().equals(userId);
    }
}

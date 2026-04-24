package com.lebronJamesCars.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class IdentityManagement {
    @Id
    @GeneratedValue
    private long IdentityManagementId;
    //list of users
    private String Users;

    public void register(){}
    public void login(){}
    public void logout(){}


    public String getUsers() {
        return Users;
    }

    public void setUsers(String users) {
        Users = users;
    }

    public long getIdentityManagementId() {
        return IdentityManagementId;
    }

    public void setIdentityManagementId(long identityManagementId) {
        IdentityManagementId = identityManagementId;
    }



}

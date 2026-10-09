package com.carbontrack.dto;

public class PersonalProfileDto {
    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String location;
    private String occupation;
    private String bio;

    public PersonalProfileDto() {
    }

    public PersonalProfileDto(Long id, Long userId, String name, String email, String location, String occupation, String bio) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.location = location;
        this.occupation = occupation;
        this.bio = bio;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getOccupation() {
        return occupation;
    }

    public void setOccupation(String occupation) {
        this.occupation = occupation;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }
}

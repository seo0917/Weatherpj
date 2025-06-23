package com.inforecord.model;

public class UserPreferences {
    private String favoriteSeason;
    private String favoriteWeather;
    private String dislikeSeason;
    private String dislikeWeather;

    // 기본 생성자
    public UserPreferences() {}

    // 전체 생성자
    public UserPreferences(String favoriteSeason, String favoriteWeather, String dislikeSeason, String dislikeWeather) {
        this.favoriteSeason = favoriteSeason;
        this.favoriteWeather = favoriteWeather;
        this.dislikeSeason = dislikeSeason;
        this.dislikeWeather = dislikeWeather;
    }

    // Getter와 Setter
    public String getFavoriteSeason() {
        return favoriteSeason;
    }

    public void setFavoriteSeason(String favoriteSeason) {
        this.favoriteSeason = favoriteSeason;
    }

    public String getFavoriteWeather() {
        return favoriteWeather;
    }

    public void setFavoriteWeather(String favoriteWeather) {
        this.favoriteWeather = favoriteWeather;
    }

    public String getDislikeSeason() {
        return dislikeSeason;
    }

    public void setDislikeSeason(String dislikeSeason) {
        this.dislikeSeason = dislikeSeason;
    }

    public String getDislikeWeather() {
        return dislikeWeather;
    }

    public void setDislikeWeather(String dislikeWeather) {
        this.dislikeWeather = dislikeWeather;
    }

    @Override
    public String toString() {
        return "UserPreferences{" +
                "favoriteSeason='" + favoriteSeason + '\'' +
                ", favoriteWeather='" + favoriteWeather + '\'' +
                ", dislikeSeason='" + dislikeSeason + '\'' +
                ", dislikeWeather='" + dislikeWeather + '\'' +
                '}';
    }
} 
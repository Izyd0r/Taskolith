package com.domain.repository

// TODO: add refresh token
interface SessionRepository {
    fun saveToken(accessToken: String)
    fun getAccessToken(): String?
    fun clearToken()
}
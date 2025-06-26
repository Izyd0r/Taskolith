package com.data.remote.api

import com.data.remote.dto.RegisterRequest
import com.data.remote.dto.RegisterResponse
import retrofit2.http.POST
import retrofit2.http.Body

interface AuthApiService {
    @POST("/api/auth/register")
    suspend fun registerUser(@Body request: RegisterRequest): RegisterResponse
}
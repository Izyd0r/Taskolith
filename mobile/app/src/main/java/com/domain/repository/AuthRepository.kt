package com.domain.repository

import com.data.remote.dto.LoginRequest
import com.data.remote.dto.LoginResponse
import com.data.remote.dto.RegisterRequest
import com.data.remote.dto.RegisterResponse

interface AuthRepository {
    suspend fun registerUser(request: RegisterRequest): RegisterResponse
    suspend fun loginUser(request: LoginRequest): LoginResponse
}
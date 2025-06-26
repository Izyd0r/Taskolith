package com.domain.repository

import com.data.remote.dto.RegisterRequest
import com.data.remote.dto.RegisterResponse

interface AuthRepository {
    suspend fun registerUser(request: RegisterRequest): RegisterResponse
}
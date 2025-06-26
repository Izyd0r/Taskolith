package com.data.repository

import com.data.remote.api.AuthApiService
import com.data.remote.dto.LoginRequest
import com.data.remote.dto.LoginResponse
import com.data.remote.dto.RegisterRequest
import com.data.remote.dto.RegisterResponse
import com.di.IoDispatcher
import com.domain.repository.AuthRepository
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.withContext
import javax.inject.Inject

class AuthRepositoryImpl @Inject constructor(
    private val api: AuthApiService,
    @IoDispatcher private val dispatcher: CoroutineDispatcher
) : AuthRepository {

    override suspend fun registerUser(request: RegisterRequest): RegisterResponse {
        return withContext(dispatcher) {
            api.registerUser(request)
        }
    }

    override suspend fun loginUser(request: LoginRequest): LoginResponse {
        return withContext(dispatcher) {
            api.loginUser(request)
        }
    }
}
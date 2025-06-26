package com.di

import com.data.remote.api.AuthApiService
import com.data.repository.AuthRepositoryImpl
import com.domain.repository.AuthRepository
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import kotlinx.coroutines.CoroutineDispatcher
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object RepositoryModule {

    @Provides
    @Singleton
    fun provideAuthRepository(
        api: AuthApiService,
        @IoDispatcher dispatcher: CoroutineDispatcher
    ): AuthRepository {
        return AuthRepositoryImpl(api, dispatcher)
    }
}
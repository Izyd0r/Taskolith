package com.di

import android.content.Context
import com.data.remote.api.AuthApiService
import com.data.repository.AuthRepositoryImpl
import com.data.repository.SessionManagerImpl
import com.data.repository.TasksRepositoryImpl
import com.domain.repository.AuthRepository
import com.domain.repository.SessionRepository
import com.domain.repository.TasksRepository
import dagger.Binds
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import kotlinx.coroutines.CoroutineDispatcher
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {

    @Binds
    @Singleton
    abstract fun bindSessionRepository(
        sessionManagerImpl: SessionManagerImpl
    ): SessionRepository

    @Binds
    @Singleton
    abstract fun bindTasksRepository(
        tasksRepositoryImpl: TasksRepositoryImpl
    ): TasksRepository

    companion object {
        @Provides
        @Singleton
        fun provideAuthRepository(
            api: AuthApiService,
            @IoDispatcher dispatcher: CoroutineDispatcher
        ): AuthRepository {
            return AuthRepositoryImpl(api, dispatcher)
        }

        @Provides
        @Singleton
        fun provideSessionManager(@ApplicationContext context: Context): SessionManagerImpl {
            return SessionManagerImpl(context)
        }
    }
}
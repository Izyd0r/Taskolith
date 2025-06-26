package com.data.remote.api

import com.data.remote.dto.CreateTaskRequest
import com.data.remote.dto.CreateTaskResponse
import com.data.remote.dto.GetTasksResponse
import com.data.remote.dto.UpdateTaskRequest
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path

interface TasksApiService {

    @GET("api/tasks")
    suspend fun getTasks(
        @Header("Authorization") token: String
    ): GetTasksResponse

    @PUT("api/tasks")
    suspend fun updateTask(
        @Header("Authorization") token: String,
        @Body request: UpdateTaskRequest
    )

    @DELETE("/api/tasks/{taskId}")
    suspend fun deleteTask(
        @Header("Authorization") token: String,
        @Path("taskId") taskId: String
    ): Response<Unit>

    @POST("/api/tasks")
    suspend fun createTask(
        @Header("Authorization") token: String,
        @Body request: CreateTaskRequest
    ): CreateTaskResponse
}
package com.data.remote.dto

import com.google.gson.annotations.SerializedName

data class GetTasksResponse(
    @SerializedName("userId")
    val userId: String,
    @SerializedName("tasks")
    val tasks: List<TaskDto>
)
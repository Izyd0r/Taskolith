package com.data.remote.dto


import com.google.gson.annotations.SerializedName

data class UpdateTaskRequest(
    @SerializedName("taskId")
    val taskId: String,
    @SerializedName("title")
    val title: String?,
    @SerializedName("description")
    val description: String?,
    @SerializedName("dueDate")
    val dueDate: String?,
    @SerializedName("completed")
    val isCompleted: Boolean?
)
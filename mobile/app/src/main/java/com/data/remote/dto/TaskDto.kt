package com.data.remote.dto

import com.google.gson.annotations.SerializedName

data class TaskDto(
    @SerializedName("id")
    val id: String,
    @SerializedName("userId")
    val userId: String,
    @SerializedName("title")
    val title: String,
    @SerializedName("description")
    val description: String,
    @SerializedName("dueDate")
    val dueDate: String,
    @SerializedName("createdDate")
    val createdDate: String,
    @SerializedName("isCompleted")
    val isCompleted: Boolean
)
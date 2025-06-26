package com.data.remote.dto

data class CreateTaskRequest(
    val title: String,
    val description: String?,
    val dueDate: String
)
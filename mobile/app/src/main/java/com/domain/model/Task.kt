package com.domain.model


import androidx.room.Entity
import androidx.room.PrimaryKey
import java.util.UUID

@Entity(tableName = "tasks")
data class Task(
    @PrimaryKey val id: String  = UUID.randomUUID().toString(),
    val title: String,
    val description: String,
    val dueDate: String,
    val isCompleted: Boolean,
    val created: String
)
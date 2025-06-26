package com.data.local

import androidx.room.Database
import androidx.room.RoomDatabase
import com.domain.model.Task

@Database(entities = [Task::class], version = 2, exportSchema = false)
abstract class AppDatabase : RoomDatabase() {
    abstract fun taskDao(): TaskDao
}
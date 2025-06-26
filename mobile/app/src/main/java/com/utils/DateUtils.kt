package com.utils

import java.text.SimpleDateFormat
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter
import java.util.Date
import java.util.Locale

fun String.toIsoDateString(): String {
    return try {
        val parser = SimpleDateFormat("dd.MM.yyyy", Locale.getDefault())
        val formatter = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.getDefault())
        formatter.format(parser.parse(this) ?: Date())
    } catch (e: Exception) {
        SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.getDefault()).format(Date())
    }
}

fun String.toBackendDateFormat(): String {
    val zonedDateTime = ZonedDateTime.parse(this)
    val formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy")
    return zonedDateTime.format(formatter)
}
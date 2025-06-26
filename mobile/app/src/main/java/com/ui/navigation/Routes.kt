package com.ui.navigation

sealed class Screen(val route: String) {
    data object Splash : Screen("splash")
    data object Auth : Screen("authorization")
    data object Register : Screen("register")
    data object Login : Screen("login")
    data object Main : Screen("main")
    data object Calender : Screen("calender")
    data object Profile : Screen("profile")
    data object Tasks : Screen("tasks")
    data class TaskDetail(val taskId: String) : Screen("tasks/{taskId}") {
        fun createRoute(taskId: String) = "tasks/$taskId"
    }
}
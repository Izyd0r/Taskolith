package com.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.ui.screens.AuthScreen
import com.ui.screens.LoginScreen
import com.ui.screens.MainScreen
import com.ui.screens.RegisterScreen
import com.ui.screens.SplashScreen
import com.ui.screens.EditTaskScreen
import androidx.navigation.navArgument
import androidx.navigation.NavType
import com.ui.screens.AddTaskScreen

@Composable
fun NavGraph(navController: NavHostController) {
    NavHost(navController = navController, startDestination = Screen.Splash.route) {
        // All screens goes here
        composable(Screen.Splash.route) { SplashScreen(navController) }
        composable(Screen.Auth.route) { AuthScreen(navController) }
        composable(Screen.Register.route) { RegisterScreen(navController) }
        composable(Screen.Login.route) { LoginScreen(navController) }
        composable(Screen.Main.route) { MainScreen(navController) }
        composable(
            Screen.EditTask.route,
            arguments = listOf(navArgument("taskId") { type = NavType.StringType })
        ) {
            EditTaskScreen(navController = navController)
        }
        composable(Screen.AddTask.route) {
            AddTaskScreen(navController = navController)
        }
    }
}
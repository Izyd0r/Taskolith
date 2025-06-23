package com.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.ui.screens.AuthScreen
import com.ui.screens.SplashScreen

@Composable
fun NavGraph(navController: NavHostController) {
    NavHost(navController = navController, startDestination = Screen.Splash.route) {
        // All screens goes here
        composable(Screen.Splash.route) { SplashScreen(navController) }
        composable(Screen.Auth.route) { AuthScreen(navController) }
    }
}
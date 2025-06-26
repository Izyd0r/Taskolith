package com.ui.components

import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.navigation.NavController
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.ui.theme.Satoshi
import com.ui.theme.TaskolithTheme
import com.ui.viewmodels.BottomNavItem

@Composable
fun BottomNavBar(navController: NavController) {
    val items = listOf(
        BottomNavItem.Tasks,
        BottomNavItem.Profile,
    )

    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentDestination = navBackStackEntry?.destination

    NavigationBar {
        items.forEach { screen ->
            NavigationBarItem(
                icon = { Icon(screen.icon, contentDescription = stringResource(id = screen.titleResId)) },
                label = {
                    Text(
                        text = stringResource(id = screen.titleResId),
                        style = MaterialTheme.typography.bodySmall.copy(
                            fontFamily = Satoshi,
                            fontWeight = FontWeight.Bold
                        )
                    )
                },
                selected = currentDestination?.hierarchy?.any { it.route == screen.route } == true,
                onClick = {
                    navController.navigate(screen.route) {
                        popUpTo(navController.graph.findStartDestination().id) {
                            saveState = true
                        }
                        launchSingleTop = true
                        restoreState = true
                    }
                }
            )
        }
    }
}

@Preview
@Composable
fun BottomNavBarPreview() {
    TaskolithTheme {
        BottomNavBar(navController = rememberNavController())
    }
}
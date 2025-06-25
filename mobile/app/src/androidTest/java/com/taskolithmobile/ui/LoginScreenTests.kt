package com.taskolithmobile.ui

import androidx.compose.ui.test.assertCountEquals
import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.hasClickAction
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.test.onNodeWithTag
import androidx.compose.ui.test.onNodeWithText
import androidx.navigation.compose.rememberNavController
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.filters.LargeTest
import com.ui.screens.LoginScreen
import com.ui.theme.TaskolithTheme
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
@LargeTest
class LoginScreenTests {
    @get:Rule
    val composeTestRule = createComposeRule()

    @Test
    fun loginScreenShouldHaveFourClickableObjects() {
        composeTestRule.setContent {
            TaskolithTheme {
                LoginScreen(navController = rememberNavController())
            }
        }

        val clickableNodes = composeTestRule.onAllNodes(hasClickAction())
        clickableNodes.assertCountEquals(4);
    }

    @Test
    fun loginScreenShouldHaveTwoInputFields() {
        composeTestRule.setContent {
            TaskolithTheme {
                LoginScreen(navController = rememberNavController())
            }
        }

        composeTestRule.onNodeWithTag("Username").assertIsDisplayed()
        composeTestRule.onNodeWithTag("Password").assertIsDisplayed()
    }

    @Test
    fun loginScreenShouldHaveTitle() {
        composeTestRule.setContent {
            TaskolithTheme {
                LoginScreen(navController = rememberNavController())
            }
        }

        composeTestRule.onNodeWithText("Login").assertIsDisplayed()
    }
}
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
import com.ui.screens.RegisterScreen
import com.ui.theme.TaskolithTheme
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
@LargeTest
class RegisterScreenTests {

    @get:Rule
    val composeTestRule = createComposeRule()

    @Test
    fun registerScreenShouldHaveNineClickableObjects() {
        composeTestRule.setContent {
            TaskolithTheme {
                RegisterScreen(navController = rememberNavController())
            }
        }

        val clickableNodes = composeTestRule.onAllNodes(hasClickAction())
        clickableNodes.assertCountEquals(9);
    }

    @Test
    fun registerScreenShouldHaveSixInputFields() {
        composeTestRule.setContent {
            TaskolithTheme {
                RegisterScreen(navController = rememberNavController())
            }
        }

        composeTestRule.onNodeWithTag("First Name").assertIsDisplayed()
        composeTestRule.onNodeWithText("Last Name").assertIsDisplayed()
        composeTestRule.onNodeWithText("Username").assertIsDisplayed()
        composeTestRule.onNodeWithText("Email").assertIsDisplayed()
        composeTestRule.onNodeWithText("Password").assertIsDisplayed()
        composeTestRule.onNodeWithText("Confirm Password").assertIsDisplayed()
    }

    @Test
    fun registerScreenHaveTitle() {
        composeTestRule.setContent {
            TaskolithTheme {
                RegisterScreen(navController = rememberNavController())
            }
        }

        composeTestRule.onNodeWithText("Sign Up").assertIsDisplayed()
    }
}
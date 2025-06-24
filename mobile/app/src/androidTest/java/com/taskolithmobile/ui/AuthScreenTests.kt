package com.taskolithmobile.ui

import androidx.compose.ui.test.assertCountEquals
import androidx.compose.ui.test.assertHasNoClickAction
import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.assertTextContains
import androidx.compose.ui.test.hasClickAction
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.test.onNodeWithTag
import androidx.compose.ui.test.onNodeWithText
import androidx.navigation.compose.rememberNavController
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.filters.LargeTest
import com.ui.screens.AuthScreen
import com.ui.theme.TaskolithTheme
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
@LargeTest
class AuthScreenTests {

    @get:Rule
    val composeTestRule = createComposeRule()

    @Test
    fun authScreenShouldHaveTwoButton() {
        composeTestRule.setContent {
            TaskolithTheme {
                AuthScreen(navController = rememberNavController())
            }
        }

        val clickableNodes = composeTestRule.onAllNodes(hasClickAction())
        clickableNodes.assertCountEquals(2);
        composeTestRule
            .onNodeWithText("Login")
            .assertIsDisplayed()
        composeTestRule
            .onNodeWithText("Register")
            .assertIsDisplayed()
    }

    @Test
    fun authScreenHaveAppNameAtTop() {
        composeTestRule.setContent {
            TaskolithTheme {
                AuthScreen(navController = rememberNavController())
            }
        }

        composeTestRule
            .onNodeWithTag("appName")
            .assertIsDisplayed()
            .assertTextContains("Taskolith")
            .assertHasNoClickAction()
    }

    @Test
    fun authScreenShouldHaveOrBetweenButtons() {
        composeTestRule.setContent {
            TaskolithTheme {
                AuthScreen(navController = rememberNavController())
            }
        }

        composeTestRule
            .onNodeWithText("OR")
            .assertIsDisplayed()
            .assertHasNoClickAction()
    }
}
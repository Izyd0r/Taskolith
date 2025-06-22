package com.taskolithmobile.ui

import androidx.compose.ui.test.assertCountEquals
import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.assertTextContains
import androidx.compose.ui.test.hasClickAction
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.compose.ui.test.onNodeWithTag
import androidx.test.ext.junit.rules.ActivityScenarioRule
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.filters.LargeTest
import com.MainActivity
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
@LargeTest
class SplashScreenTests {

    @get:Rule
    val activityRule = ActivityScenarioRule(MainActivity::class.java)

    @get:Rule
    val composeTestRule = createAndroidComposeRule<MainActivity>()

    @Test
    fun splash_Screen_Should_Contain_Visible_Text_Element() {
        composeTestRule
            .onNodeWithTag("appName")
            .assertIsDisplayed()
    }

    @Test
    fun splashScreen_Should_Contain_Element_With_Taskolith_Text() {
        composeTestRule
            .onNodeWithTag("appName")
            .assertTextContains("Taskolith")
    }

    @Test
    fun splashScreen_Should_Not_Contain_Any_Clickable_Elements() {
        val clickableNodes = composeTestRule.onAllNodes(hasClickAction())
        clickableNodes.assertCountEquals(0);
    }
}
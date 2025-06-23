import androidx.compose.ui.test.assertCountEquals
import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.assertTextContains
import androidx.compose.ui.test.hasClickAction
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.compose.ui.test.onAllNodesWithTag
import androidx.compose.ui.test.onAllNodesWithText
import androidx.compose.ui.test.onNodeWithTag
import androidx.compose.ui.test.onNodeWithText
import androidx.test.ext.junit.rules.ActivityScenarioRule
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.filters.LargeTest
import com.MainActivity
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith


@RunWith(AndroidJUnit4::class)
@LargeTest
class NavigationTests {

    @get:Rule
    val composeTestRule = createAndroidComposeRule<MainActivity>()

    @Test
    fun splash_navigates_to_auth_screen_after_delay() {
        composeTestRule.onNodeWithTag("appName").assertIsDisplayed()

        composeTestRule.waitUntil(timeoutMillis = 3000) {
            composeTestRule.onAllNodesWithTag("RegisterButton").fetchSemanticsNodes().isNotEmpty() &&
                    composeTestRule.onAllNodesWithTag("LoginButton").fetchSemanticsNodes().isNotEmpty()
        }

        composeTestRule.onNodeWithTag("RegisterButton").assertIsDisplayed()
        composeTestRule.onNodeWithTag("LoginButton").assertIsDisplayed()
    }
}
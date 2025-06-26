import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.compose.ui.test.onAllNodesWithTag
import androidx.compose.ui.test.onNodeWithTag
import androidx.compose.ui.test.performClick
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.filters.LargeTest
import com.MainActivity
import kotlinx.coroutines.test.runTest
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
@LargeTest
class NavigationTests {

    @get:Rule
    val composeTestRule = createAndroidComposeRule<MainActivity>()

    @Test
    fun splashScreen_navigatesToAuthScreen_afterDelay() = runTest {
        composeTestRule.waitUntil(timeoutMillis = 3000L) {
            composeTestRule
                .onAllNodesWithTag("AuthScreen")
                .fetchSemanticsNodes()
                .isNotEmpty()
        }

        composeTestRule.onNodeWithTag("AuthScreen").assertIsDisplayed()
        composeTestRule.onNodeWithTag("RegisterButton").assertIsDisplayed()
        composeTestRule.onNodeWithTag("LoginButton").assertIsDisplayed()
    }

    @Test
    fun authScreen_navigatesToRegister_onRegisterClick() = runTest {
        composeTestRule.waitUntil(timeoutMillis = 3000L) {
            composeTestRule
                .onAllNodesWithTag("AuthScreen")
                .fetchSemanticsNodes()
                .isNotEmpty()
        }

        composeTestRule.onNodeWithTag("AuthScreen").assertIsDisplayed()
        composeTestRule.onNodeWithTag("RegisterButton").performClick()
        composeTestRule.onNodeWithTag("RegisterScreen").assertIsDisplayed()
    }

    @Test
    fun authScreen_navigatesToLogin_onLoginClick() = runTest {
        composeTestRule.waitUntil(timeoutMillis = 3000L) {
            composeTestRule
                .onAllNodesWithTag("AuthScreen")
                .fetchSemanticsNodes()
                .isNotEmpty()
        }

        composeTestRule.onNodeWithTag("AuthScreen").assertIsDisplayed()
        composeTestRule.onNodeWithTag("LoginButton").performClick()
        composeTestRule.onNodeWithTag("LoginScreen").assertIsDisplayed()
    }
}
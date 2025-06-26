package com.taskolithmobile.integration

import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.assertIsEnabled
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.compose.ui.test.onNodeWithTag
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.performTextInput
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.filters.LargeTest
import com.MainActivity
import com.data.remote.api.AuthApiService
import com.data.repository.AuthRepositoryImpl
import com.di.DispatchersModule
import com.di.IoDispatcher
import com.di.MainDispatcher
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.testing.HiltAndroidRule
import dagger.hilt.android.testing.HiltAndroidTest
import dagger.hilt.android.testing.UninstallModules
import dagger.hilt.components.SingletonComponent
import okhttp3.mockwebserver.MockResponse
import okhttp3.mockwebserver.MockWebServer
import org.junit.After
import org.junit.Before
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import javax.inject.Singleton
import com.di.NetworkModule
import com.di.RepositoryModule
import com.domain.repository.AuthRepository
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.ExperimentalCoroutinesApi
import javax.inject.Inject


//
//  THIS WHOLE SECTION DOESN'T WORK AS INTENDED, INTEGRATION TEST CANT PASS THE AUTH SCREEN
//

@ExperimentalCoroutinesApi
@HiltAndroidTest
@UninstallModules(NetworkModule::class, DispatchersModule::class, RepositoryModule::class)
@RunWith(AndroidJUnit4::class)
@LargeTest
class UserRegistrationTests {

    @get:Rule(order = 0)
    var hiltRule = HiltAndroidRule(this)

    @get:Rule(order = 1)
    val mainCoroutineRule = MainDispatcherRule(SharedTestDispatchers.testDispatcher)

    @get:Rule(order = 2)
    val composeTestRule = createAndroidComposeRule<MainActivity>()

    @Inject
    lateinit var mockWebServer: MockWebServer


    @Before
    fun setUp() {
        hiltRule.inject()
        //mockWebServer.start()
    }

    @After
    fun tearDown() {
        mockWebServer.shutdown()
    }

    @Test
    fun register_success_displaysSuccessState() {
        mockWebServer.enqueue(
            MockResponse()
                .setResponseCode(201)
                .setBody(
                    """
                {
                    "id": "some_id",
                    "username": "testuser",
                    "firstName": "firstname",
                    "lastName": "lastname",
                    "email": "email@email.com",
                    "token": "fake_JWT_token"
                }
                """.trimIndent()
                )
        )
        mainCoroutineRule.testDispatcher.scheduler.advanceUntilIdle()
        composeTestRule.waitForIdle()

        composeTestRule.onNodeWithTag("AuthScreen").assertIsDisplayed()

        composeTestRule.onNodeWithTag("RegisterButton")
            .assertIsDisplayed()
            .performClick()

        composeTestRule.waitForIdle()

        composeTestRule.onNodeWithTag("First Name").performTextInput("firstname")
        composeTestRule.onNodeWithTag("Last Name").performTextInput("lastname")
        composeTestRule.onNodeWithTag("Username").performTextInput("testuser")
        composeTestRule.onNodeWithTag("Email").performTextInput("email@email.com")
        composeTestRule.onNodeWithTag("Password").performTextInput("Password1!")
        composeTestRule.onNodeWithTag("Repeat Password").performTextInput("Password1!")

        val submitButton = composeTestRule.onNodeWithText("Register")
        submitButton.assertIsEnabled()
        submitButton.performClick()

        mainCoroutineRule.testDispatcher.scheduler.advanceUntilIdle()
        composeTestRule.waitForIdle()

        composeTestRule.onNodeWithText("Log In", useUnmergedTree = true).assertIsDisplayed()
    }

    @Module
    @InstallIn(SingletonComponent::class)
    object TestAppModule {

        @Provides
        @Singleton
        fun provideMockWebServer(): MockWebServer {
            return MockWebServer().apply {
                start()
            }
        }

        @Provides
        @Singleton
        fun provideAuthApiService(mockWebServer: MockWebServer): AuthApiService {
            return Retrofit.Builder()
                .baseUrl(mockWebServer.url("/"))
                .addConverterFactory(GsonConverterFactory.create())
                .build()
                .create(AuthApiService::class.java)
        }

        @Provides
        @Singleton
        fun provideAuthRepository(
            api: AuthApiService,
            @IoDispatcher dispatcher: CoroutineDispatcher
        ): AuthRepository = AuthRepositoryImpl(api, dispatcher)

        @Provides
        @Singleton
        @MainDispatcher
        fun provideTestMainDispatcher(): CoroutineDispatcher = SharedTestDispatchers.testDispatcher

        @Provides
        @Singleton
        @IoDispatcher
        fun provideTestIoDispatcher(): CoroutineDispatcher = SharedTestDispatchers.testDispatcher

    }
}
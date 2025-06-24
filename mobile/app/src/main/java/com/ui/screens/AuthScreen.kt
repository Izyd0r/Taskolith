package com.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController
import com.ui.components.AppButton
import com.ui.components.AppTitle
import com.ui.navigation.Screen
import com.ui.theme.Satoshi
import com.ui.theme.TaskolithTheme

@Composable
fun AuthScreen(
    navController: NavController
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.surface)
            .testTag("AuthScreen")
    ) {
        AppTitle(
            modifier = Modifier
                .align(Alignment.TopCenter)
                .offset(y = 40.dp)
                .fillMaxWidth()
        )

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(20.dp),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            AppButton(
                text = "Login",
                onClick =  { navController.navigate(Screen.Login.route)},
                modifier = Modifier.testTag("LoginButton")
            )

            Spacer(modifier = Modifier.height(16.dp))

            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp)
            ) {
                HorizontalDivider(
                    modifier = Modifier
                        .weight(1f)
                        .height(1.dp),
                    color = MaterialTheme.colorScheme.primary
                )

                Text(
                    text = "OR",
                    style = MaterialTheme.typography.bodyLarge.copy(
                        fontFamily = Satoshi,
                        fontWeight = FontWeight.Medium
                    ),
                    modifier = Modifier
                        .padding(horizontal = 8.dp)
                        .testTag("OrText")
                )

                HorizontalDivider(
                    modifier = Modifier
                        .weight(1f)
                        .height(1.dp),
                    color = MaterialTheme.colorScheme.primary
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            AppButton(
                text = "Register",
                onClick =  { navController.navigate(Screen.Register.route) },
                modifier = Modifier.testTag("RegisterButton")
            )
        }
    }
}

@Preview(
    showBackground = true,
    showSystemUi = true,
    device = "spec:width=411dp,height=891dp,dpi=420"
)
@Composable
fun AuthScreenPreview() {
    TaskolithTheme {
        AuthScreen(navController = rememberNavController())
    }
}
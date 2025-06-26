package com.ui.components

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.sp
import com.ui.theme.Satoshi

@Composable
fun AppTitle(
    modifier: Modifier = Modifier
) {
    Text(
        text = "Taskolith",
        modifier = modifier
            .testTag("appName"),
        textAlign = TextAlign.Center,
        style = MaterialTheme.typography.displayLarge.copy(
            fontFamily = Satoshi,
            fontWeight = FontWeight.Black,
            fontSize = 86.sp
        )
    )
}
package com.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.width
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.ui.theme.Satoshi

@Composable
fun AppButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()

    val disabledContainerColor = MaterialTheme.colorScheme.secondary.copy(alpha = 0.5f)
    val disabledContentColor = MaterialTheme.colorScheme.onSecondary.copy(alpha = 0.5f)
    val disabledBorderColor = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.38f)

    Button(
        onClick = onClick,
        enabled = enabled,
        shape = MaterialTheme.shapes.medium,
        colors = ButtonDefaults.buttonColors(
            containerColor = if (isPressed) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.secondary,
            contentColor = if (isPressed) MaterialTheme.colorScheme.secondary else MaterialTheme.colorScheme.onSecondary,
            disabledContainerColor = disabledContainerColor,
            disabledContentColor = disabledContentColor
        ),
        border = BorderStroke(2.dp,
            if (enabled) {
                if (isPressed) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurface
            } else {
                disabledBorderColor
            }
        ),
        interactionSource = interactionSource,
        contentPadding = PaddingValues(vertical = 16.dp, horizontal = 32.dp),
        modifier = Modifier
            .width(237.dp)
            .height(74.dp)
            .then(modifier)
    ) {
        Text(
            text = text,
            style = MaterialTheme.typography.headlineLarge.copy(
                fontFamily = Satoshi,
                fontWeight = FontWeight.Bold
            )
        )
    }
}
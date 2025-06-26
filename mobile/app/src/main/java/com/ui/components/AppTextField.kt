package com.ui.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.taskolithmobile.R
import com.ui.theme.Satoshi

@Composable
fun AppTextField(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    isError: Boolean = false,
    errorMessage: String? = null,
    isPassword: Boolean = false
) {
    var isFocused by remember { mutableStateOf(false) }
    var passwordVisible by remember { mutableStateOf(false) }
    val isLabelUp = isFocused || value.isNotEmpty()

    val labelOffsetY by animateDpAsState(
        targetValue = if (isLabelUp) (-25).dp else 0.dp,
        label = "LabelY"
    )
    val labelFontSize by animateFloatAsState(
        targetValue = if (isLabelUp) 12f else 28f,
        label = "LabelSize"
    )
    val borderColor by animateColorAsState(
        targetValue = if (isError) MaterialTheme.colorScheme.error else if (isFocused) MaterialTheme.colorScheme.primary else Color.Black,
        label = "BorderColor"
    )

    Column(modifier = modifier) {
        Box(
            modifier = Modifier
                .testTag(label)
                .width(304.dp)
                .height(69.dp)
                .background(MaterialTheme.colorScheme.secondary)
                .drawBehind {
                    val strokeWidth = 2.dp.toPx()
                    drawLine(
                        color = borderColor,
                        start = Offset(0f, size.height),
                        end = Offset(size.width, size.height),
                        strokeWidth = strokeWidth
                    )
                }
        ) {
            TextField(
                value = value,
                onValueChange = onValueChange,
                modifier = Modifier
                    .fillMaxSize()
                    .padding(top = 16.dp, start = 12.dp, end = 12.dp)
                    .onFocusChanged { focusState ->
                        isFocused = focusState.isFocused
                    },
                colors = TextFieldDefaults.colors(
                    focusedContainerColor = Color.Transparent,
                    unfocusedContainerColor = Color.Transparent,
                    disabledContainerColor = Color.Transparent,
                    focusedIndicatorColor = Color.Transparent,
                    unfocusedIndicatorColor = Color.Transparent
                ),
                textStyle = MaterialTheme.typography.bodyLarge.copy(
                    fontFamily = Satoshi,
                    fontWeight = FontWeight.Bold
                ),
                maxLines = 1,
                singleLine = true,
                visualTransformation = if (isPassword && !passwordVisible) PasswordVisualTransformation() else VisualTransformation.None,
                keyboardOptions = if (isPassword) KeyboardOptions(keyboardType = KeyboardType.Password) else KeyboardOptions.Default,
                trailingIcon = {
                    if (isPassword) {
                        val painter = if (passwordVisible)
                            painterResource(id = R.drawable.visibility)
                        else
                            painterResource(id = R.drawable.visibility_lock)

                        val description = if (passwordVisible) "Hide password" else "Show password"

                        IconButton(onClick = { passwordVisible = !passwordVisible }) {
                            Icon(painter = painter, contentDescription = description)
                        }
                    }
                }
            )
            Text(
                text = label,
                style = MaterialTheme.typography.headlineLarge.copy(
                    fontFamily = Satoshi,
                    fontWeight = FontWeight.Bold,
                    fontSize = labelFontSize.sp,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                ),
                modifier = Modifier
                    .align(Alignment.CenterStart)
                    .padding(start = 12.dp)
                    .graphicsLayer {
                        translationY = labelOffsetY.toPx()
                    }
            )
        }
        if (errorMessage != null) {
            Text(
                text = errorMessage,
                color = MaterialTheme.colorScheme.error,
                style = MaterialTheme.typography.bodySmall,
                modifier = Modifier.padding(start = 16.dp, top = 4.dp)
            )
        }
    }
}
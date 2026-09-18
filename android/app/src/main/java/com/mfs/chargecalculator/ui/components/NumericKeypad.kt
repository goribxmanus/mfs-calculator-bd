package com.mfs.chargecalculator.ui.components

import android.view.HapticFeedbackConstants
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.combinedClickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Backspace
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun NumericKeypad(
    onDigit: (String) -> Unit,
    onDecimal: () -> Unit,
    onBackspace: () -> Unit,
    modifier: Modifier = Modifier
) {
    val view = LocalView.current

    val triggerHaptic = {
        view.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
    }

    Column(
        modifier = modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(6.dp)
    ) {
        // Row 1: 1, 2, 3
        KeypadRow {
            KeypadButton(text = "1", onClick = { triggerHaptic(); onDigit("1") }, modifier = Modifier.weight(1f))
            KeypadButton(text = "2", onClick = { triggerHaptic(); onDigit("2") }, modifier = Modifier.weight(1f))
            KeypadButton(text = "3", onClick = { triggerHaptic(); onDigit("3") }, modifier = Modifier.weight(1f))
        }

        // Row 2: 4, 5, 6
        KeypadRow {
            KeypadButton(text = "4", onClick = { triggerHaptic(); onDigit("4") }, modifier = Modifier.weight(1f))
            KeypadButton(text = "5", onClick = { triggerHaptic(); onDigit("5") }, modifier = Modifier.weight(1f))
            KeypadButton(text = "6", onClick = { triggerHaptic(); onDigit("6") }, modifier = Modifier.weight(1f))
        }

        // Row 3: 7, 8, 9
        KeypadRow {
            KeypadButton(text = "7", onClick = { triggerHaptic(); onDigit("7") }, modifier = Modifier.weight(1f))
            KeypadButton(text = "8", onClick = { triggerHaptic(); onDigit("8") }, modifier = Modifier.weight(1f))
            KeypadButton(text = "9", onClick = { triggerHaptic(); onDigit("9") }, modifier = Modifier.weight(1f))
        }

        // Row 4: 00, 0, ⌫
        KeypadRow {
            KeypadButton(
                text = "00",
                onClick = { triggerHaptic(); onDigit("00") },
                modifier = Modifier.weight(1f)
            )
            KeypadZeroButton(
                onZeroClick = { triggerHaptic(); onDigit("0") },
                onDecimalClick = { triggerHaptic(); onDecimal() },
                modifier = Modifier.weight(1f)
            )
            KeypadBackspaceButton(
                onBackspace = { triggerHaptic(); onBackspace() },
                modifier = Modifier.weight(1f)
            )
        }
    }
}

@Composable
private fun KeypadRow(content: @Composable () -> Unit) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(6.dp)
    ) {
        content()
    }
}

@Composable
private fun KeypadButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Surface(
        onClick = onClick,
        modifier = modifier.height(45.dp),
        shape = RoundedCornerShape(11.dp),
        color = MaterialTheme.colorScheme.surface,
        shadowElevation = 1.dp
    ) {
        Box(contentAlignment = Alignment.Center) {
            Text(
                text = text,
                style = MaterialTheme.typography.titleLarge.copy(
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 20.sp,
                    color = MaterialTheme.colorScheme.onSurface
                )
            )
        }
    }
}

@OptIn(ExperimentalFoundationApi::class)
@Composable
private fun KeypadZeroButton(
    onZeroClick: () -> Unit,
    onDecimalClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Surface(
        modifier = modifier
            .height(45.dp)
            .clip(RoundedCornerShape(11.dp)),
        shape = RoundedCornerShape(11.dp),
        color = MaterialTheme.colorScheme.surface,
        shadowElevation = 1.dp
    ) {
        Box(
            modifier = Modifier
                .combinedClickable(
                    onClick = onZeroClick,
                    onLongClick = onDecimalClick
                ),
            contentAlignment = Alignment.Center
        ) {
            Row(
                verticalAlignment = Alignment.Bottom,
                horizontalArrangement = Arrangement.Center
            ) {
                Text(
                    text = "0",
                    style = MaterialTheme.typography.titleLarge.copy(
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 20.sp,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                )
                Text(
                    text = " •",
                    style = MaterialTheme.typography.bodySmall.copy(
                        color = MaterialTheme.colorScheme.primary,
                        fontWeight = FontWeight.Bold,
                        fontSize = 11.sp
                    ),
                    modifier = Modifier.padding(bottom = 2.dp)
                )
            }
        }
    }
}

@Composable
private fun KeypadBackspaceButton(
    onBackspace: () -> Unit,
    modifier: Modifier = Modifier
) {
    Surface(
        onClick = onBackspace,
        modifier = modifier.height(45.dp),
        shape = RoundedCornerShape(11.dp),
        color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
        shadowElevation = 1.dp
    ) {
        Box(contentAlignment = Alignment.Center) {
            Icon(
                imageVector = Icons.AutoMirrored.Filled.Backspace,
                contentDescription = "Backspace",
                tint = MaterialTheme.colorScheme.onSurface,
                modifier = Modifier.size(20.dp)
            )
        }
    }
}

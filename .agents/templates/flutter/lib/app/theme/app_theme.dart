import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shadcn_ui/shadcn_ui.dart';
import 'app_colors.dart';
import 'app_radius.dart';

class AppTheme {
  const AppTheme._();

  static ShadThemeData get shadcnDark {
    return ShadThemeData(
      brightness: Brightness.dark,
      colorScheme: ShadSlateColorScheme.dark(
        primary: AppColors.ctaOrange,
        background: AppColors.canvas,
        foreground: AppColors.textPrimary,
        card: AppColors.surface,
        cardForeground: AppColors.textPrimary,
        popover: AppColors.elevated,
        popoverForeground: AppColors.textPrimary,
        muted: AppColors.soft,
        mutedForeground: AppColors.textMuted,
        accent: AppColors.soft,
        accentForeground: AppColors.textPrimary,
        destructive: AppColors.danger,
        border: AppColors.lineSubtle,
        input: AppColors.lineSubtle,
        ring: AppColors.lineStrong,
      ),
      radius: BorderRadius.circular(AppRadius.md),
    );
  }

  static ThemeData get light {
    final colorScheme = ColorScheme.fromSeed(
      seedColor: AppColors.ctaOrange,
      brightness: Brightness.light,
    );

    return ThemeData(
      colorScheme: colorScheme,
      useMaterial3: true,
      textTheme: GoogleFonts.archivoTextTheme(),
      appBarTheme: const AppBarTheme(centerTitle: false, elevation: 0),
      cardTheme: const CardThemeData(margin: EdgeInsets.zero),
    );
  }

  static ThemeData get dark {
    final baseTextTheme = GoogleFonts.archivoTextTheme(ThemeData.dark().textTheme);
    
    final textTheme = baseTextTheme.copyWith(
      displayLarge: baseTextTheme.displayLarge?.copyWith(
        fontWeight: FontWeight.bold,
        color: AppColors.textPrimary,
        letterSpacing: -1.0,
      ),
      headlineMedium: baseTextTheme.headlineMedium?.copyWith(
        fontWeight: FontWeight.w600,
        color: AppColors.textPrimary,
        letterSpacing: -0.5,
      ),
      bodyLarge: baseTextTheme.bodyLarge?.copyWith(
        color: AppColors.textPrimary,
      ),
      bodyMedium: baseTextTheme.bodyMedium?.copyWith(
        color: AppColors.textSecondary,
      ),
      bodySmall: baseTextTheme.bodySmall?.copyWith(
        color: AppColors.textMuted,
      ),
    );

    final colorScheme = ColorScheme.fromSeed(
      seedColor: AppColors.ctaOrange,
      brightness: Brightness.dark,
      surface: AppColors.canvas,
      onSurface: AppColors.textPrimary,
    );

    return ThemeData(
      colorScheme: colorScheme,
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: AppColors.canvas,
      textTheme: textTheme,
      appBarTheme: const AppBarTheme(
        centerTitle: false,
        elevation: 0,
        backgroundColor: AppColors.canvas,
        foregroundColor: AppColors.textPrimary,
      ),
      cardTheme: const CardThemeData(
        margin: EdgeInsets.zero,
        color: AppColors.surface,
      ),
    );
  }
}

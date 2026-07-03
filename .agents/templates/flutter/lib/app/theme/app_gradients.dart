import 'package:flutter/material.dart';
import 'app_colors.dart';

class AppGradients {
  const AppGradients._();

  static const mainBackground = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [
      AppColors.navy,
      Color(0xFF0A1229),
    ],
  );

  static RadialGradient glowTopLeft(Color color) => RadialGradient(
        center: const Alignment(-1.2, -1.2),
        radius: 1.5,
        colors: [
          color.withOpacity(0.15),
          color.withOpacity(0),
        ],
      );

  static RadialGradient glowBottomRight(Color color) => RadialGradient(
        center: const Alignment(1.2, 1.2),
        radius: 1.5,
        colors: [
          color.withOpacity(0.1),
          color.withOpacity(0),
        ],
      );
}

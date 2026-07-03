import 'package:flutter/material.dart';

class AppShadows {
  const AppShadows._();

  static List<BoxShadow> get glow => [
        const BoxShadow(
          color: Color(0x26107EFF),
          blurRadius: 40,
          offset: Offset(0, 16),
        ),
      ];

  static List<BoxShadow> get glowSm => [
        const BoxShadow(
          color: Color(0x26107EFF),
          blurRadius: 12,
          offset: Offset(0, 4),
        ),
      ];

  static List<BoxShadow> get soft => [
        BoxShadow(
          color: Colors.black.withOpacity(0.12),
          blurRadius: 26,
          offset: const Offset(0, 4),
        ),
      ];
}

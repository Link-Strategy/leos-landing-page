import 'package:flutter/material.dart';
import 'package:letron_ui/letron_ui.dart';
import './router/app_router.dart';
import './theme/app_theme.dart';

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return ShadApp.router(
      title: 'Satellite App',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.dark, // Fallback to dark as default for LeOS
      darkTheme: AppTheme.shadcnDark,
      materialThemeBuilder: (context, theme) => AppTheme.dark,
      routerConfig: appRouter,
      builder: (context, child) => LetronBackground(child: child!),
    );
  }
}

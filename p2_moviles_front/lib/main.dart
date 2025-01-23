import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'views/home_view.dart';
import 'controllers/verdura_controller.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (_) => VerduraController(),
      child: MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Verduras App',
      theme: ThemeData(primarySwatch: Colors.green),
      home: HomeView(),
    );
  }
}

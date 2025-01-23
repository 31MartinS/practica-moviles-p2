import 'package:flutter/material.dart';
import '../models/verdura_model.dart';
import '../services/api_service.dart';

class VerduraController extends ChangeNotifier {
  final ApiService apiService = ApiService();
  List<Verdura> verduras = [];

  Future<void> fetchVerduras(String id) async {
    final data = await apiService.getVerduras(id);
    verduras = data.map((e) => Verdura.fromJson(e)).toList();
    notifyListeners();
  }

  Future<void> agregarVerdura(String id, Verdura verdura) async {
    await apiService.agregarVerdura(id, verdura.toJson());
    verduras.add(verdura);
    notifyListeners();
  }
}

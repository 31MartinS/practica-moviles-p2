import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  final String baseUrl = 'http://localhost:3000/archivo';

  Future<List<dynamic>> getVerduras(String id) async {
    final response = await http.get(Uri.parse('$baseUrl/$id'));
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Error al obtener las verduras');
    }
  }

  Future<void> agregarVerdura(String id, Map<String, dynamic> verdura) async {
    final response = await http.post(
      Uri.parse('$baseUrl/$id'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(verdura),
    );
    if (response.statusCode != 200) {
      throw Exception('Error al agregar la verdura');
    }
  }

  Future<void> actualizarVerdura(String id, Map<String, dynamic> verdura) async {
    final response = await http.put(
      Uri.parse('$baseUrl/$id'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(verdura),
    );
    if (response.statusCode != 200) {
      throw Exception('Error al actualizar la verdura');
    }
  }
}

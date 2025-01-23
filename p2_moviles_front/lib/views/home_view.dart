import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../controllers/verdura_controller.dart';
import '../models/verdura_model.dart';


class HomeView extends StatelessWidget {
  final String archivoId = '1OToRZWAacu6FvV-5CAGhSE9b2CKdFP4s';

  @override
  Widget build(BuildContext context) {
    final verduraController = Provider.of<VerduraController>(context);

    return Scaffold(
      appBar: AppBar(title: Text('Verduras')),
      body: FutureBuilder(
        future: verduraController.fetchVerduras(archivoId),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          }
          return ListView.builder(
            itemCount: verduraController.verduras.length,
            itemBuilder: (context, index) {
              final verdura = verduraController.verduras[index];
              return ListTile(
                title: Text(verdura.descripcion),
                subtitle: Text('Precio: ${verdura.precio}'),
              );
            },
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          // Agregar una verdura nueva
          final nuevaVerdura = Verdura(codigo: 4, descripcion: 'Tomate', precio: 10.5);
          await verduraController.agregarVerdura(archivoId, nuevaVerdura);
        },
        child: Icon(Icons.add),
      ),
    );
  }
}

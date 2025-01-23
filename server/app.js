const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');

const app = express();
app.use(bodyParser.json());

// Configuración de Google API
const KEYFILE = './macro-incline-448716-p0-d588f0a14a19.json'; // Ruta local del archivo JSON descargado
const SCOPES = ['https://www.googleapis.com/auth/drive'];
const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILE,
  scopes: SCOPES,
});
const drive = google.drive({ version: 'v3', auth });

// Función para leer el archivo desde Google Drive
async function getFile(fileId) {
  try {
    const response = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' }
    );
    return new Promise((resolve, reject) => {
      let data = '';
      response.data.on('data', (chunk) => (data += chunk));
      response.data.on('end', () => resolve(JSON.parse(data)));
      response.data.on('error', (error) => reject(error));
    });
  } catch (error) {
    console.error('Error al obtener el archivo:', error.message);
    throw error;
  }
}

// Función para actualizar el archivo en Google Drive
async function updateFile(fileId, newData) {
  const buffer = Buffer.from(JSON.stringify(newData, null, 2)); // Formato legible
  try {
    await drive.files.update({
      fileId,
      media: {
        mimeType: 'application/json',
        body: buffer,
      },
    });
    return { message: 'Archivo actualizado exitosamente.' };
  } catch (error) {
    console.error('Error al actualizar el archivo:', error.message);
    throw error;
  }
}

// Crear una nueva verdura (agregar al archivo JSON)
app.post('/archivo/:id', async (req, res) => {
  const { id } = req.params; // ID del archivo en Google Drive
  const nuevaVerdura = req.body; // Recibe la nueva verdura en el cuerpo de la solicitud

  try {
    // 1. Leer el contenido actual del archivo
    const contenidoActual = await getFile(id);

    // 2. Agregar la nueva verdura
    contenidoActual.push(nuevaVerdura);

    // 3. Subir el archivo actualizado a Google Drive
    const resultado = await updateFile(id, contenidoActual);

    res.json({ message: 'Nueva verdura agregada exitosamente.', resultado });
  } catch (error) {
    console.error('Error al agregar la verdura:', error.message);
    res.status(500).json({ error: 'Error al agregar la verdura.' });
  }
});

// Actualizar una verdura existente (basado en su "codigo")
app.put('/archivo/:id', async (req, res) => {
  const { id } = req.params; // ID del archivo en Google Drive
  const { codigo, ...nuevaInformacion } = req.body; // Recibe el código y la nueva información

  try {
    // 1. Leer el contenido actual del archivo
    const contenidoActual = await getFile(id);

    // 2. Buscar y actualizar la verdura por su "codigo"
    const index = contenidoActual.findIndex((verdura) => verdura.codigo === codigo);
    if (index === -1) {
      return res.status(404).json({ error: `La verdura con código ${codigo} no existe.` });
    }

    contenidoActual[index] = { ...contenidoActual[index], ...nuevaInformacion };

    // 3. Subir el archivo actualizado a Google Drive
    const resultado = await updateFile(id, contenidoActual);

    res.json({ message: 'Verdura actualizada exitosamente.', resultado });
  } catch (error) {
    console.error('Error al actualizar la verdura:', error.message);
    res.status(500).json({ error: 'Error al actualizar la verdura.' });
  }
});

// Leer el archivo
app.get('/archivo/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await getFile(id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al leer el archivo.' });
  }
});

// Eliminar el archivo
app.delete('/archivo/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await drive.files.delete({ fileId: id });
    res.json({ message: 'Archivo eliminado exitosamente.', result });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el archivo.' });
  }
});

// Crear un nuevo archivo (opcional, mantener si es necesario)
app.post('/archivo', async (req, res) => {
  const { name, data } = req.body;
  try {
    const buffer = Buffer.from(JSON.stringify(data, null, 2));
    const file = await drive.files.create({
      requestBody: {
        name,
        mimeType: 'application/json',
      },
      media: {
        mimeType: 'application/json',
        body: buffer,
      },
    });
    res.json({ message: 'Archivo creado exitosamente.', fileId: file.data.id });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el archivo.' });
  }
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));

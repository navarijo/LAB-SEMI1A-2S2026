import React, { useState } from 'react';

const App = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const APIM = "https://carpeta-funciones-apim.azure-api.net"; 

  // convertir el archivo a una cadena Base64 limpia
  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    // data después de la coma // base64,iVBOR...')
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = (error) => reject(error);
  });

  const handleUpload = async () => {
    if (!file) return setStatus('Por favor, selecciona un archivo primero.');
    
    setLoading(true);
    setStatus('Subiendo imagen a Azure Blob Storage...');

    try {
      //convirtiendo archivo a base64
      const base64Data = await toBase64(file);
      
      const azureResponse = await fetch(APIM, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fileName: file.name,    // Nombre
          fileType: file.type,    // Tipo
          fileBase64: base64Data  // Imagen en base64
        }),
      });

      const azureData = await azureResponse.json();

      if (!azureResponse.ok) {
        throw new Error(azureData.message || 'Error al cargar en Azure');
      }

      // Éxito: Se utiliza el 'message' y la 'url' devueltos por el endpoint PUT
      setStatus(`${azureData.message} | URL: ${azureData.url}`);
      setFile(null); 

    } catch (err) {
      setStatus(`Error: ${err.message}`);
      console.error("Detalle del error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-blue-700 mb-2">CloudDrive</h1>
          <p className="text-slate-500 text-sm font-medium">Gestión de Archivos Multi-Cloud</p>
        </div>
        
        <div className="space-y-6">
          <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-4 hover:border-blue-400 transition-colors group">
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="text-center">
              <span className="text-slate-600 text-sm block truncate">
                {file ? file.name : "Selecciona una imagen..."}
              </span>
            </div>
          </div>
          
          <button 
            onClick={handleUpload}
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all transform active:scale-95 shadow-lg ${
              loading 
                ? 'bg-slate-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Procesando carga...' : 'Cargar a la Nube'}
          </button>

          {status && (
            <div className={`mt-6 p-4 rounded-xl text-xs font-bold text-center uppercase tracking-widest leading-relaxed break-words ${
              status.includes('Error') 
                ? 'bg-red-50 text-red-600' 
                : 'bg-blue-50 text-blue-600'
            }`}>
              {status}
            </div>
          )}
        </div>

        {/* Información técnica para el estudiante */}
        <div className="mt-10 pt-6 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 font-mono uppercase text-center">
            Paso 1: Azure Functions (PUT)
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
import os
import base64
import requests

def call_detect_labels():
    
    url = "http://localhost:3000/detect-labels"
    folder_name = "img"
    base_filename = "cam.jpg" 
    
    image_path = os.path.join(folder_name, base_filename)

    try:
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"No se encontró la imagen '{base_filename}' en la carpeta '{folder_name}'.")

        with open(image_path, "rb") as image_file:
            encoded_string = base64.b64encode(image_file.read()).decode('utf-8')

        payload = {"image_base64": encoded_string}

        print(f"Enviando '{image_path}' al endpoint de etiquetas...")
        response = requests.post(url, json=payload)
        
        if response.status_code == 200:
            resultado = response.json()
            
            labels = resultado.get("labels", [])
            
            print(f"\n--- {len(labels)} Objetos detectados ---")
            for item in labels:
                nombre = item.get("Name")
                confianza = item.get("Confidence")
                print(f"- {nombre} (Confianza: {confianza:.2f}%)")
        else:
            print(f"Error del servidor ({response.status_code}): {response.text}")

    except FileNotFoundError as e:
        print(f"Error de archivo: {e}")
    except requests.exceptions.ConnectionError:
        print("Error: No se pudo conectar con el servidor en el puerto 3000.")
    except Exception as e:
        print(f"Ocurrió un error inesperado: {e}")

if __name__ == "__main__":
    call_detect_labels()
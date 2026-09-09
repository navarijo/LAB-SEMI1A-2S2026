import os
import base64
import requests

def call_detect_text():
    url = "http://localhost:3000/detect-text"
    folder_name = "img"
    base_filename = "texto2.png"
    
    image_path = os.path.join(folder_name, f"{base_filename}")

    try:
        if not image_path:
            raise FileNotFoundError(f"No se encontró la imagen '{base_filename}' con extensiones comunes en la carpeta '{folder_name}'.")

        with open(image_path, "rb") as image_file:
            encoded_string = base64.b64encode(image_file.read()).decode('utf-8')

        payload = {"image_base64": encoded_string}

        print(f"Enviando '{image_path}' al servidor...")
        response = requests.post(url, json=payload)
        cadena = ""
        
        if response.status_code == 200:
            resultado = response.json()
            for linea in resultado.get("detected_text", []):
                cadena += linea 
            print("\nTexto completo detectado:")
            print(cadena)
        else:
            print(f"Error del servidor ({response.status_code}): {response.text}")

    except FileNotFoundError as e:
        print(f"Error de archivo: {e}")
    except requests.exceptions.ConnectionError:
        print("Error: No se pudo conectar con el servidor. ¿Está encendido en el puerto 3000?")
    except Exception as e:
        print(f"Ocurrió un error inesperado: {e}")

if __name__ == "__main__":
    call_detect_text()
import boto3
import base64
import os
from fastapi import FastAPI, HTTPException, Body
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Inicializamos el cliente de Polly
polly = boto3.client(
    'polly',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_REGION')
)

@app.post("/sintetizar")
async def synthesize_text(
    text: str = Body(..., embed=True),
    voice: str = Body("Mia", embed=True) 
):
    try:
        # Llamando a polly para sintetizar el texto
        response = polly.synthesize_speech(
            Text=text,
            OutputFormat='mp3',
            VoiceId=voice
        )

        # leyendo los bytes del AudioStream y convertirlos a Base64
        audio_bytes = response['AudioStream'].read()
        audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')

        return {
            "status": "success",
            "voice_used": voice,
            "audio_base64": audio_base64,
            "format": "mp3"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
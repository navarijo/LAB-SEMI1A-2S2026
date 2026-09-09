import base64
import boto3
import os
from fastapi import FastAPI, HTTPException, Body
from dotenv import load_dotenv

# cargando mis variables de enterno
load_dotenv()

app = FastAPI()

# cliente rekog
rekognition = boto3.client(
    'rekognition',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_REGION')
)

@app.post("/detect-labels")
async def detect_labels(image_base64: str = Body(..., embed=True)):
    try:
        image_bytes = base64.b64decode(image_base64)
        
        response = rekognition.detect_labels(
            Image={'Bytes': image_bytes},
            MaxLabels=10,
            MinConfidence=80
        )
        
        return {"labels": response['Labels']}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en AWS Rekognition: {str(e)}")

@app.post("/compare-faces")
async def compare_faces(
    source_base64: str = Body(...), 
    target_base64: str = Body(...)
):
    try:
        source_bytes = base64.b64decode(source_base64)
        target_bytes = base64.b64decode(target_base64)
        
        response = rekognition.compare_faces(
            SourceImage={'Bytes': source_bytes},
            TargetImage={'Bytes': target_bytes}
        )
        
        return {"matches": response['FaceMatches']}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/detect-text")
async def detect_text(image_base64: str = Body(..., embed=True)):
    try:
        image_bytes = base64.b64decode(image_base64)
        response = rekognition.detect_text(Image={'Bytes': image_bytes})
        
        # filtro
        detections = [text['DetectedText'] for text in response['TextDetections'] if text['Type'] == 'LINE']
        return {"detected_text": detections}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3000)
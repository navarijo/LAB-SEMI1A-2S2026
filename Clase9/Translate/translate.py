import boto3
import os
from fastapi import FastAPI, HTTPException, Body
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

translate = boto3.client(
    'translate',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_REGION')
)

@app.post("/translate")
async def translate_to_spanish(text: str = Body(..., embed=True)):
    try:
        if not text:
            raise HTTPException(status_code=400, detail="El texto no puede estar vacío")

        response = translate.translate_text(
            Text=text,
            SourceLanguageCode='auto', 
            TargetLanguageCode='es'    
        )
        
        return {
            "original_text": text,
            "translated_text": response['TranslatedText'],
            "source_language": response['SourceLanguageCode']
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en AWS Translate: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=4000)
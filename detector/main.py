from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from PIL import Image, ImageDraw
import io
import tempfile
import easyocr

app = FastAPI()

UPLOAD_DIR = "images"

@app.post("/image")
async def upload_image(file: UploadFile = File(...)):
    reader = easyocr.Reader(['en'], gpu=False)
    image = Image.open(io.BytesIO(await file.read()))
    with tempfile.NamedTemporaryFile(suffix=".png", delete=True) as tmp:
        image.save(tmp.name)
        result = reader.readtext(tmp.name)
        
    card_ids = []
    for res in result:
        (_, txt, _) = res
        
        if '/' in txt:
            splited_txt = txt.split(' ')
            for s in splited_txt:
                card_ids.append(s)
    
    return JSONResponse(content={"ocr_result": card_ids})

from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from PIL import Image
import io
import tempfile
import easyocr

app = FastAPI()

@app.post("/image")
async def upload_image(file: UploadFile = File(...), confident: float = 0.5):
    reader = easyocr.Reader(['en'])
    image = Image.open(io.BytesIO(await file.read()))
    with tempfile.NamedTemporaryFile(suffix=".png", delete=True) as tmp:
        image.save(tmp.name)
        result = reader.readtext(tmp.name)

    card_text = []
    for res in result:
        (_, txt, conf) = res
        
        if conf > confident:
            card_text.append(txt)

    return JSONResponse(content={"ocr": card_text})

from fastapi import FastAPI, Query
import datetime

app = FastAPI(title="FastAPI Serverless AI Function", version="1.0.0")

@app.get("/api/proses_ai")
@app.get("/")
def proses_ai(input: str = Query("Teks Default AI", description="Parameter query data teks yang akan diproses")):
    input_str = str(input)
    
    # Simulasi pemrosesan AI (analisis teks & transformasi)
    processed_text = input_str.upper()
    words = input_str.split()
    
    return {
        "status": "success",
        "engine": "FastAPI (Python Serverless Function)",
        "input": input_str,
        "ai_result": {
            "summary": f"Hasil Analisis AI untuk '{input_str}'",
            "transformed_text": processed_text,
            "metrics": {
                "character_count": len(input_str),
                "word_count": len(words)
            },
            "sentiment": "Positive",
            "confidence": 0.99
        },
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }

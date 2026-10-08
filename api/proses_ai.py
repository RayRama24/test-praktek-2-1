from fastapi import FastAPI, Query
import asyncio
import time

app = FastAPI(title="FastAPI Serverless AI API", version="3.0.0")

# Model A: Random Forest (RF) dengan delay 0.3 detik
async def simulate_model_rf(text: str):
    await asyncio.sleep(0.3)
    keywords_bahaya = ["malware", "virus", "hack", "phishing", "danger", "bahaya", "attack", "exploit", "trojan"]
    is_bahaya = any(word in text.lower() for word in keywords_bahaya)
    prediction = "BAHAYA" if is_bahaya else "AMAN"
    
    base_conf = 0.88 + (len(text) % 10) * 0.01
    confidence = min(0.99, max(0.50, base_conf))
    
    return {
        "model": "Random Forest",
        "prediction": prediction,
        "confidence": round(confidence, 2)
    }

# Model B: Support Vector Machine (SVM) dengan delay 0.5 detik
async def simulate_model_svm(text: str):
    await asyncio.sleep(0.5)
    keywords_bahaya = ["malware", "virus", "hack", "phishing", "danger", "bahaya", "attack", "exploit", "trojan"]
    is_bahaya = any(word in text.lower() for word in keywords_bahaya)
    prediction = "BAHAYA" if is_bahaya else "AMAN"
    
    base_conf = 0.91 + (len(text) % 7) * 0.01
    confidence = min(0.99, max(0.50, base_conf))
    
    return {
        "model": "Support Vector Machine",
        "prediction": prediction,
        "confidence": round(confidence, 2)
    }

@app.get("/api/proses_ai")
@app.get("/")
async def proses_ai(input: str = Query("Teks Input AI", description="Parameter query data teks yang akan diproses")):
    input_str = str(input)
    
    # 1. Catat waktu mulai
    start_time = time.time()
    
    try:
        # 2. Jalankan dua model async paralel via asyncio.gather()
        res_rf, res_svm = await asyncio.gather(
            simulate_model_rf(input_str),
            simulate_model_svm(input_str)
        )
        
        # 3. Catat waktu selesai
        end_time = time.time()
        duration_seconds = round(end_time - start_time, 4)
        
        # 4. Return format JSON sesuai spesifikasi
        return {
            "status": "success",
            "duration_seconds": duration_seconds,
            "result": {
                "model_rf": res_rf,
                "model_svm": res_svm
            }
        }
    except Exception as e:
        end_time = time.time()
        duration_seconds = round(end_time - start_time, 4)
        return {
            "status": "error",
            "duration_seconds": duration_seconds,
            "result": {
                "error_detail": str(e)
            }
        }

from fastapi import FastAPI, Query
import asyncio
import time
import datetime

app = FastAPI(title="FastAPI Async AI Serverless Function", version="2.0.0")

# Simulasi Model A: Random Forest (RF) dengan delay 0.3 detik
async def simulate_model_rf(text: str):
    await asyncio.sleep(0.3)
    words = len(text.split())
    sentiment = "Positive" if len(text) % 2 == 0 else "Neutral"
    confidence = 0.89 + (len(text) % 10) * 0.01
    return {
        "model_name": "Random Forest (RF)",
        "delay_seconds": 0.3,
        "prediction": sentiment,
        "confidence_score": round(confidence, 4),
        "word_count": words
    }

# Simulasi Model B: Support Vector Machine (SVM) dengan delay 0.5 detik
async def simulate_model_svm(text: str):
    await asyncio.sleep(0.5)
    category = "Teknologi" if any(keyword in text.lower() for keyword in ["ai", "vercel", "python", "fastapi"]) else "Umum"
    score = 0.92 + (len(text) % 5) * 0.01
    return {
        "model_name": "Support Vector Machine (SVM)",
        "delay_seconds": 0.5,
        "classification": category,
        "accuracy_score": round(score, 4),
        "char_count": len(text)
    }

@app.get("/api/proses_ai")
@app.get("/")
async def proses_ai(input: str = Query("Teks Input Async AI", description="Parameter query data teks yang akan diproses")):
    input_str = str(input)
    
    # 1. Catat Waktu mulai sebelum gather
    start_time = time.time()
    
    # 2. Memanggil dua fungsi async secara bersamaan dengan asyncio.gather()
    res_rf, res_svm = await asyncio.gather(
        simulate_model_rf(input_str),
        simulate_model_svm(input_str)
    )
    
    # 3. Catat Waktu selesai setelah gather
    end_time = time.time()
    execution_time = round(end_time - start_time, 4)
    
    return {
        "status": "success",
        "engine": "FastAPI Async Python Serverless Function",
        "input": input_str,
        "async_metrics": {
            "start_time": start_time,
            "end_time": end_time,
            "total_execution_time_seconds": execution_time,
            "concurrency_benefit": "Eksekusi paralel ~0.5 detik (bukan sekuensial 0.8 detik)"
        },
        "model_results": {
            "model_a_rf": res_rf,
            "model_b_svm": res_svm
        },
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }

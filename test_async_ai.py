import sys
import asyncio
import time

# Ensure UTF-8 output encoding for Windows terminal compatibility
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from api.proses_ai import simulate_model_rf, simulate_model_svm

async def run_concurrency_test():
    test_input = "Uji Konkurensi Sistem AI Malware Phishing"
    
    print("=" * 65)
    print("       UJI KONKURENSI ASYNCIO.GATHER (LOCAL TEST SCRIPT)        ")
    print("=" * 65)
    print(f"Data Input Teks                        : '{test_input}'")
    print("Delay Model A (Random Forest / RF)     : 0.3 detik")
    print("Delay Model B (Support Vector / SVM)   : 0.5 detik")
    print("Waktu Sekuensial Teoretis (0.3s + 0.5s): 0.8 detik")
    print("-" * 65)
    
    # 1. Catat Waktu Mulai (time.time()) sebelum gather
    start_time = time.time()
    
    # 2. Panggil dua fungsi async secara bersamaan dengan asyncio.gather()
    res_rf, res_svm = await asyncio.gather(
        simulate_model_rf(test_input),
        simulate_model_svm(test_input)
    )
    
    # 3. Catat Waktu Selesai (time.time()) setelah gather
    end_time = time.time()
    total_time = round(end_time - start_time, 4)
    
    print("\n--- HASIL PREDIKSI MODEL AI ---")
    print(f"Model RF  Result : {res_rf}")
    print(f"Model SVM Result : {res_svm}")
    print("-" * 65)
    print(f"Waktu Mulai   : {start_time:.4f}")
    print(f"Waktu Selesai : {end_time:.4f}")
    print(f"Waktu Total   : {total_time:.4f} detik")
    print("-" * 65)
    
    print("\n--- BUKTI KONKURENSI HASIL EKSEKUSI ---")
    if total_time < 0.7:
        print(f"[SUCCESS] BUKTI SUKSES: Waktu total = {total_time:.1f} detik (sesuai waktu model terlama 0.5s),")
        print(f"          BUKAN 0.8 detik (penjumlahan sekuensial 0.3s + 0.5s).")
    else:
        print(f"[FAILED] TERJADI SEKUENSIAL: Waktu total = {total_time:.4f} detik.")
    print("=" * 65)

if __name__ == "__main__":
    asyncio.run(run_concurrency_test())

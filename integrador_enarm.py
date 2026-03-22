import os
import json
from supabase import create_client, Client

# 1. Configuración de acceso a Supabase
url: str = "https://ktseviubgaucgdrqnxqx.supabase.co"
key: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0c2V2aXViZ2F1Y2dkcnFueHF4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDAwNzQ5NywiZXhwIjoyMDg5NTgzNDk3fQ.QiTzUawNJJOV2IN466Nm0RJadCkHyYgYrlgEf9JDyVE"
supabase: Client = create_client(url, key)

def cargar_desde_txt(archivo_txt, nombre_modulo):
    print(f"\n--- 📦 Abriendo archivo: {archivo_txt} ---")
    
    if not os.path.exists(archivo_txt):
        print(f"❌ Error: No se encontró '{archivo_txt}' en esta carpeta.")
        return

    # 2. Intentar leer en UTF-8, y si falla, usar Latin-1 (Windows)
    try:
        with open(archivo_txt, 'r', encoding='utf-8') as f:
            datos = json.load(f)
    except UnicodeDecodeError:
        print("⚠️ Detectada codificación de Windows (ANSI). Aplicando antídoto 'latin-1'...")
        with open(archivo_txt, 'r', encoding='latin-1') as f:
            datos = json.load(f)
    except Exception as e:
        print(f"❌ Error al abrir el archivo: {e}")
        return

    print(f"✅ JSON validado. Procesando {len(datos)} casos de {nombre_modulo}...")

    # 3. Subir a Supabase
    try:
        for caso in datos:
            registro = {
                "id_caso": caso.get("id_caso"),
                "tema_principal": caso.get("tema_principal"),
                "vineta_clinica": caso.get("vineta_clinica"),
                "analisis_interno": caso.get("analisis_interno"),
                "preguntas": caso.get("preguntas"),
                "referencia_oficial": caso.get("referencia_oficial"),
                "joya_enarm": caso.get("joya_enarm"),
                "modulo": nombre_modulo
            }
            supabase.table("bancos_enarm").upsert(registro).execute()
            print(f"   -> ✅ Caso integrado: {caso.get('id_caso')}")

        print(f"🚀 ¡Módulo {nombre_modulo} cargado con éxito a la Bóveda!")

    except json.JSONDecodeError as e:
        print(f"❌ Error de formato JSON en el archivo:")
        print(f"   Detalle: {e}. Revisa comillas y corchetes.")
    except Exception as e:
        print(f"❌ Error inesperado al subir: {e}")

# --- 🚀 EJECUCIÓN ---
cargar_desde_txt('Batch_GyO_Vaginosis.txt', 'Ginecologia')
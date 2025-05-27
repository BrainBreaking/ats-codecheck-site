---
title: Ejemplo de .NET Framework 4.5
sidebar_position: 3
---

# 🛠️ Ejemplo de Integración con .NET Framework 4.5

Este ejemplo muestra cómo usar la librería compartida nativa **ATS CodeCheck** desde una aplicación `.NET Framework 4.5` usando **P/Invoke** para llamar funciones nativas.

## 🧱 Firmas de Funciones Nativas

Asegúrate de usar las firmas de función correctas definidas en la librería nativa:

```c
extern int ATS_Init();
extern int ATS_CheckCode(const char* jsonRequest, char* jsonResponseBuffer, int bufferSize);
extern int ATS_GetVersion(char* versionBuffer, int bufferSize);
```

## 📄 Declaración en C#

```csharp
using System;
using System.Runtime.InteropServices;
using System.Text;

class Program
{
    [DllImport("atscodecheck.dll", CallingConvention = CallingConvention.Cdecl)]
    public static extern int ATS_Init();

    [DllImport("atscodecheck.dll", CallingConvention = CallingConvention.Cdecl)]
    public static extern int ATS_GetVersion(StringBuilder versionBuffer, int bufferSize);

    [DllImport("atscodecheck.dll", CallingConvention = CallingConvention.Cdecl)]
    public static extern int ATS_CheckCode(string jsonRequest, StringBuilder jsonResponseBuffer, int bufferSize);

    static void Main()
    {
        // Inicializar la librería
        if (ATS_Init() != 0)
        {
            Console.WriteLine("❌ Inicialización falló");
            return;
        }

        // Obtener versión de la librería
        StringBuilder version = new StringBuilder(256);
        if (ATS_GetVersion(version, version.Capacity) == 0)
        {
            Console.WriteLine("📦 Versión de la Librería: " + version.ToString());
        }

        // Crear solicitud
        string base64Barcode = "REEMPLAZAR_CON_BASE64_VALIDO";
        string json = $"{{ \"base64Barcode\": \"{base64Barcode}\", \"requestFields\": [\"CEDNUM\", \"NUMPREP\"] }}";

        StringBuilder response = new StringBuilder(2048);
        int result = ATS_CheckCode(json, response, response.Capacity);

        if (result == 0)
        {
            Console.WriteLine("✅ Respuesta: " + response.ToString());
        }
        else
        {
            Console.WriteLine("❌ ATS_CheckCode falló con código: " + result);
        }
    }
}
```

> ⚠️ Nota:
> - Asegúrate de que `atscodecheck.dll` y `libatscodecheck.h` estén ubicados en el directorio de salida de tu compilación.

---

## 📬 ¿Preguntas?

Contacta [support@atscodecheck.dev](mailto:support@atscodecheck.dev) para ayuda.
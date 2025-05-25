---
title: Ejemplo de Integración
sidebar_position: 2
---

# 🛠️ Ejemplo de Integración

Este ejemplo demuestra cómo integrar la librería ATS CodeCheck en una aplicación C para validar códigos de barras de cédulas de identidad colombianas.

## 1. Inicializar la Librería

```c
#include "libatscodecheck.h"

int result = ATS_Init();
if (result != 0) {
    printf("❌ Inicialización falló\n");
}
```

## 2. Validar un Código de Barras

```c
const char* jsonRequest = "{ \"base64Barcode\": \"...\", \"requestFields\": [\"CEDNUM\", \"NUMPREP\"] }";

char responseBuffer[2048];
int code = ATS_CheckCode(jsonRequest, responseBuffer, sizeof(responseBuffer));

if (code == 0) {
    printf("✅ Respuesta: %s\n", responseBuffer);
} else {
    printf("❌ ATS_CheckCode falló con código: %d\n", code);
}

```

## 3. Ejemplo Completo

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// Funciones externas de la librería compartida Go
extern int ATS_Init();
extern int ATS_CheckCode(const char* jsonRequest, char* jsonResponseBuffer, int bufferSize);
extern int ATS_GetVersion(char* versionBuffer, int bufferSize);

int main() {
    // Inicializar la librería Go
    if (ATS_Init() != 0) {
        printf("❌ Error al inicializar ATSCodeCheck\n");
        return 1;
    }

    // Obtener versión de la librería
    char version[256] = {0};
    if (ATS_GetVersion(version, sizeof(version)) == 0) {
        printf("📦 Versión de la Librería: %s\n", version);
    }

    // Ejemplo de código de barras codificado en Base64 (reemplazar con uno real para pruebas)
    const char* base64Input = "REEMPLAZAR_CON_BASE64_VALIDO";

    // Crear payload de solicitud JSON
    const char* fieldList = "\"NUMPREP\"";
    char jsonRequest[1024];
    snprintf(jsonRequest, sizeof(jsonRequest),
             "{ \"base64Barcode\": \"%s\", \"requestFields\": [%s] }",
             base64Input, fieldList);

    // Preparar buffer de respuesta
    char response[2048] = {0};

    // Ejecutar verificación
    int result = ATS_CheckCode(jsonRequest, response, sizeof(response));
    if (result == 0) {
        printf("✅ Respuesta: %s\n", response);
    } else {
        printf("❌ ATS_CheckCode falló con código: %d\n", result);
    }

    return 0;
}

```
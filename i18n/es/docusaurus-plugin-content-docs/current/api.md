---
id: api
title: Referencia de API
sidebar_position: 2
---

# 📘 Referencia de API

La librería **ATS CodeCheck** proporciona las siguientes funciones:

---

## `int ATS_Init(void);`

Inicializa la librería. Debe ser llamada antes que cualquier otra función.

**Retorna:**
- `0` en caso de éxito
- Distinto de cero en caso de fallo

```c
int ATS_Init(void);
```

---

## `int ATS_CheckCode(const char* jsonRequest, char* jsonResponseBuffer, int bufferSize);`

Valida un código de barras codificado en base64 y extrae los campos solicitados.

**Parámetros:**
- `jsonRequest`: Cadena JSON que contiene el código de barras en base64 y los campos solicitados.
- `jsonResponseBuffer`: Buffer para almacenar la respuesta JSON.
- `bufferSize`: Tamaño del buffer de respuesta.

**Retorna:**
- `0` en caso de éxito
- Distinto de cero en caso de fallo

```c
int ATS_CheckCode(const char* jsonRequest, char* jsonResponseBuffer, int bufferSize);
```

---

## `int ATS_GetVersion(char* versionBuffer, int bufferSize);`

Obtiene la versión de la librería ATS CodeCheck.

**Parámetros:**
- `versionBuffer`: Buffer para almacenar la cadena de versión.
- `bufferSize`: Tamaño del buffer.

**Retorna:**
- `0` en caso de éxito
- Distinto de cero en caso de fallo

```c
int ATS_GetVersion(char* versionBuffer, int bufferSize);
```
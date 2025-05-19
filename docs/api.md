---
id: api
title: API Reference
sidebar_position: 2
---

# 📘 API Reference

The **ATS CodeCheck** library provides the following functions:

---

## `int ATS_Init(void);`

Initializes the library. Must be called before any other functions.

**Returns:**
- `0` on success
- Non-zero on failure

```c
int ATS_Init(void);
```

---

## `int ATS_CheckCode(const char* jsonRequest, char* jsonResponseBuffer, int bufferSize);`

Validates a base64-encoded barcode and extracts requested fields.

**Parameters:**
- `jsonRequest`: JSON string containing the base64 barcode and requested fields.
- `jsonResponseBuffer`: Buffer to store the JSON response.
- `bufferSize`: Size of the response buffer.

**Returns:**
- `0` on success
- Non-zero on failure

```c
int ATS_CheckCode(const char* jsonRequest, char* jsonResponseBuffer, int bufferSize);
```

---

## `int ATS_GetVersion(char* versionBuffer, int bufferSize);`

Retrieves the version of the ATS CodeCheck library.

**Parameters:**
- `versionBuffer`: Buffer to store the version string.
- `bufferSize`: Size of the buffer.

**Returns:**
- `0` on success
- Non-zero on failure

```c
int ATS_GetVersion(char* versionBuffer, int bufferSize);
```

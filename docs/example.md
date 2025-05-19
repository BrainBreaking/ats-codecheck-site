---
title: Integration Example
sidebar_position: 2
---

# 🛠️ Integration Example

This example demonstrates how to integrate the ATS CodeCheck library into a C application to validate Colombian identity card barcodes.

## 1. Initialize the Library

```c
#include "libatscodecheck.h"

int result = ATS_Init();
if (result != 0) {
    printf("❌ Initialization failed\n");
}
```

## 2. Validate a Barcode

```c
const char* jsonRequest = "{ \"base64Barcode\": \"...\", \"requestFields\": [\"CEDNUM\", \"NUMPREP\"] }";

char responseBuffer[2048];
int code = ATS_CheckCode(jsonRequest, responseBuffer, sizeof(responseBuffer));

if (code == 0) {
    printf("✅ Response: %s\n", responseBuffer);
} else {
    printf("❌ ATS_CheckCode failed with code: %d\n", code);
}

```

## 3. Full Example

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// External functions from the Go shared library
extern int ATS_Init();
extern int ATS_CheckCode(const char* jsonRequest, char* jsonResponseBuffer, int bufferSize);
extern int ATS_GetVersion(char* versionBuffer, int bufferSize);

int main() {
    // Initialize the Go library
    if (ATS_Init() != 0) {
        printf("❌ Failed to initialize ATSCodeCheck\n");
        return 1;
    }

    // Get library version
    char version[256] = {0};
    if (ATS_GetVersion(version, sizeof(version)) == 0) {
        printf("📦 Library Version: %s\n", version);
    }

    // Example Base64-encoded barcode (replace with real one for testing)
    const char* base64Input = "REPLACE_WITH_VALID_BASE64_BARCODE";

    // Create JSON request payload
    const char* fieldList = "\"NUMPREP\"";
    char jsonRequest[1024];
    snprintf(jsonRequest, sizeof(jsonRequest),
             "{ \"base64Barcode\": \"%s\", \"requestFields\": [%s] }",
             base64Input, fieldList);

    // Prepare response buffer
    char response[2048] = {0};

    // Run verification
    int result = ATS_CheckCode(jsonRequest, response, sizeof(response));
    if (result == 0) {
        printf("✅ Response: %s\n", response);
    } else {
        printf("❌ ATS_CheckCode failed with code: %d\n", result);
    }

    return 0;
}

```

---
layout: default
title: ATS CodeCheck Library
---

# 🧠 ATS CodeCheck Library

**ATS CodeCheck** is a cross-platform native library designed to validate Colombian identity card barcodes. It provides a simple API that can be used from C/C++ and other languages that support native FFI (foreign function interface).

- 🔄 Supports **Linux**, **macOS**, and **Windows**
- 🔒 Secure validation of digital signatures
- ⚡️ Lightweight & embeddable in native apps or middleware
- 📦 Available as `.dll`, `.so`, `.dylib` + C header
- 📦 Developer Licences Available upon request support@atscodecheck.dev

---

## 🚀 Getting Started

### 1. Download the Latest Release

[![Release](https://img.shields.io/github/v/release/BrainBreaking/ats-codecheck-lib?label=Latest%20Release)](https://github.com/BrainBreaking/ats-codecheck-lib/releases/latest)

## 🔗 Download Latest Release Artifacts

You can download platform-specific builds from Google Cloud Storage:

- **macOS**: [Download dylib](https://storage.googleapis.com/atscodecheck-releases/latest/atscodecheck-macos-v1.0.0.zip)
- **Linux**: [Download .so](https://storage.googleapis.com/atscodecheck-releases/latest/atscodecheck-linux-v1.0.0.zip)
- **Windows**: [Download DLL](https://storage.googleapis.com/atscodecheck-releases/latest/atscodecheck-windows-v1.0.0.zip)

Choose your platform and download the ZIP file containing:
- The shared library (`.dll`, `.so`, or `.dylib`)
- The header file `libatscodecheck.h`

---

### 2. Initialize the Library

```c
// C example
#include "libatscodecheck.h"

int result = ATS_Init();
if (result != 0) {
    printf("❌ Initialization failed\n");
}
```

---

### 3. Validate a Barcode

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

🧪 basic working example.

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


---

## 📄 Response Format

The response is a JSON object like:

```json
{
  "txid": "uuid-1234",
  "message": "Valid Signature",
  "version": "PMT102_531",
  "id": "02",
  "fields": {
    "CEDNUM": "0012345678",
    "NUMPREP": "1234567"
  },
  "valid": true
}
```

---

## 📬 Contact

For commercial or enterprise integration support, email:  
**support@atscodecheck.dev**

---

© 2025 [BrainBreaking](https://github.com/BrainBreaking). All rights reserved.
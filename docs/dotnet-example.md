---
title: .NET Framework 4.5 Example
sidebar_position: 3
---

# 🛠️ .NET Framework 4.5 Integration Example

This example shows how to use the **ATS CodeCheck** native shared library from a `.NET Framework 4.5` application using **P/Invoke** to call native functions.

## 🧱 Native Function Signatures

Make sure to use the correct function signatures defined in the native library:

```c
extern int ATS_Init();
extern int ATS_CheckCode(const char* jsonRequest, char* jsonResponseBuffer, int bufferSize);
extern int ATS_GetVersion(char* versionBuffer, int bufferSize);
```

## 📄 C# Declaration

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
        // Initialize the library
        if (ATS_Init() != 0)
        {
            Console.WriteLine("❌ Initialization failed");
            return;
        }

        // Get library version
        StringBuilder version = new StringBuilder(256);
        if (ATS_GetVersion(version, version.Capacity) == 0)
        {
            Console.WriteLine("📦 Library Version: " + version.ToString());
        }

        // Create request
        string base64Barcode = "REPLACE_WITH_VALID_BASE64";
        string json = $"{{ \"base64Barcode\": \"{base64Barcode}\", \"requestFields\": [\"CEDNUM\", \"NUMPREP\"] }}";

        StringBuilder response = new StringBuilder(2048);
        int result = ATS_CheckCode(json, response, response.Capacity);

        if (result == 0)
        {
            Console.WriteLine("✅ Response: " + response.ToString());
        }
        else
        {
            Console.WriteLine("❌ ATS_CheckCode failed with code: " + result);
        }
    }
}
```

> ⚠️ Note:
> - Ensure `atscodecheck.dll` and `libatscodecheck.h` are placed in your build output directory.

---

## 📬 Questions?

Contact [support@atscodecheck.dev](mailto:support@atscodecheck.dev) for help.
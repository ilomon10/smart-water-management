#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>

const char *ssid = "ZTE_2.4G_PxyyDY";
const char *password = "Qz2uDcHz";

String serverName = "http://192.168.1.7:3001/api/push";

void setup()
{
    Serial.begin(115200);

    WiFi.begin(ssid, password);
    Serial.println("Connecting");
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }
    Serial.println("");
    Serial.print("Connected to WiFi network with IP Address: ");
    Serial.println(WiFi.localIP());
}

void loop()
{
    if (WiFi.status() == WL_CONNECTED)
    {
        HTTPClient http;

        String serverPath = serverName + "?watt=24.37&level=24.37&flow=24.37";

        http.begin(serverPath.c_str());

        int httpResponseCode = http.GET();

        if (httpResponseCode > 0)
        {
            Serial.print("HTTP Response code: ");
            Serial.println(httpResponseCode);
            String payload = http.getString();
            Serial.println(payload);
        }
        else
        {
            Serial.print("Error code: ");
            Serial.println(httpResponseCode);
        }
        
        http.end();
    }
    delay(10000);
}

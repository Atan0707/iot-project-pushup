#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <ESPAsyncWebServer.h>

const char* ssid = "uba-arduino-2.4G";
const char* password = "izhanhebat123";

AsyncWebServer server(80);
char data[50];

void setup() {
  Serial.begin(115200);

  // Connect to WiFi
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi..");
  }

  delay(5000); // Add delay after WiFi connection
  Serial.println("Connected to WiFi");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request) {
    request->send(200, "text/plain", data);
  });
  server.begin();
}

void loop() {
  
  if (WiFi.status() == WL_CONNECTED) {

      // Send GET request
      HTTPClient httpGet;
      httpGet.begin("http://192.168.1.2:3000/getData");
      int httpCodeGet = httpGet.GET();

      if (httpCodeGet > 0) {
        String payloadGet = httpGet.getString();
        Serial.print("Payload: ");
        Serial.println(payloadGet);

        DynamicJsonDocument doc(1024);
        deserializeJson(doc, payloadGet);

        // Get value from JSON
        int value = doc["value"]; // ni method utk extract data dari json
      } else {
      Serial.print("GET request failed with status code ");
      Serial.println(httpCodeGet);
    } 
    httpGet.end();
    

    // Send POST request
    HTTPClient httpPost;
    httpPost.begin("http://192.168.1.2:3000/postData");
    httpPost.addHeader("Content-Type", "application/json");

    // Create JSON object
    DynamicJsonDocument doc(1024);
    doc["value"] = counter;
    String requestBody;
    serializeJson(doc, requestBody);

    int httpCodePost = httpPost.POST(requestBody);

    if (httpCodePost > 0) {
      String payloadPost = httpPost.getString();
      Serial.print("Payload:");
      Serial.println(payloadPost);
    } else {
      Serial.print("POST request failed with status code ");
      Serial.println(httpCodePost);
    }
    httpPost.end();

  }
}
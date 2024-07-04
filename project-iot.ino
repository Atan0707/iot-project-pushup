#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <ESPAsyncWebServer.h>

#define echoPin 2               // CHANGE PIN NUMBER HERE IF YOU WANT TO USE A DIFFERENT PIN
#define trigPin 4               // CHANGE PIN NUMBER HERE IF YOU WANT TO USE A DIFFERENT PIN
#define buzzPin 15
#define redPin 13
#define greenPin 12

const char* ssid = "uba-arduino-2.4G"; //uba-arduino-2.4G / Atan
const char* password = "izhanhebat123"; //izhanhebat123 / atan1234

AsyncWebServer server(80);
char data[50];

int value, target;
int counter = 0;
long duration, distance;

void setup() {
  Serial.begin(115200);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(buzzPin, OUTPUT);
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);

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

  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  duration = pulseIn(echoPin, HIGH);
  distance = duration / 58.2;
  String disp = String(distance);

  Serial.print("Distance: ");
  Serial.print(disp);
  Serial.println(" cm");
  
  if (WiFi.status() == WL_CONNECTED) {

    digitalWrite(redPin, LOW);
    digitalWrite(greenPin, HIGH);
      // Send GET request
      HTTPClient httpGet;
      httpGet.begin("http://192.168.1.2:3000/getData"); //172.20.10.12 / 192.168.1.2
      int httpCodeGet = httpGet.GET();

      if (httpCodeGet > 0) {
      String payloadGet = httpGet.getString();
      Serial.print("Payload get: ");
      Serial.println(payloadGet);

      DynamicJsonDocument doc(1024);
      deserializeJson(doc, payloadGet);

      // Corrected: Removed 'int' to use the global 'value' variable
      value = doc["value"]; // Method to extract data from JSON
      target = doc["target"];
    } else {
      Serial.print("GET request failed with status code ");
      Serial.println(httpCodeGet);
    }
    httpGet.end();
    Serial.println("Value: ");
    Serial.println(value);

    if (distance <= 15) {
    value++;
    digitalWrite(redPin, HIGH);
    digitalWrite(greenPin, LOW);
    digitalWrite(buzzPin, HIGH);  // Turn the buzzer on
    delay(100);                   // Wait for 100 milliseconds
    digitalWrite(buzzPin, LOW);   // Turn the buzzer off
    Serial.println("Value now: ");
    Serial.print(value);
  }

  if (value >= target) {
    Serial.println("Target reached!");
    digitalWrite(buzzPin, HIGH);  // Turn the buzzer on
    delay(100);                  // Wait for 1000 milliseconds
    digitalWrite(buzzPin, LOW);   // Turn the buzzer off
    delay(100);
    digitalWrite(buzzPin, HIGH);  // Turn the buzzer on
    delay(100);                  // Wait for 1000 milliseconds
    digitalWrite(buzzPin, LOW);   // Turn the buzzer off
    delay(100);
    digitalWrite(buzzPin, HIGH);  // Turn the buzzer on
    delay(100);                  // Wait for 1000 milliseconds
    digitalWrite(buzzPin, LOW);   // Turn the buzzer off
    delay(100);
    target = target + 10;
  }
    

    // Send POST request
    HTTPClient httpPost;
    httpPost.begin("http://192.168.1.2:3000/postValue"); //172.20.10.12 / 192.168.1.2
    httpPost.addHeader("Content-Type", "application/json");

    // Create JSON object
    DynamicJsonDocument doc(1024);
    doc["value"] = value;
    String requestBody;
    serializeJson(doc, requestBody);

    int httpCodePost = httpPost.POST(requestBody);

    if (httpCodePost > 0) {
      String payloadPost = httpPost.getString();
      Serial.print("Payload post value:");
      Serial.println(payloadPost);
    } else {
      Serial.print("POST request failed with status code ");
      Serial.println(httpCodePost);
    }
    httpPost.end();

    
  delay(1000);                  // Delay to avoid multiple counts for one pushup
  digitalWrite(redPin, LOW);
  digitalWrite(greenPin, HIGH);
}
#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <PZEM004Tv30.h>
#include <arduino-timer.h>

PZEM004Tv30 pzem(Serial2, 16, 17);

// Timer
auto timer = timer_create_default();

// Wifi Parameter
String serverName = "https://smart-water-management.vercel.app/api/push";
const char *ssid = "ZTE_2.4G_PxyyDY";
const char *password = "Qz2uDcHz";

// Relay Parameter
#define rly_pin 22
int rly_state = 0;

// Power Parameter
float pwr_voltage;
float pwr_current;
float pwr_power;
float pwr_energy;
float pwr_frequency;
float pwr_pf;

// Level Parameter
#define lvl_echoPin 18 // attach pin GPIO18 to pin Echo of JSN-SR04
#define lvl_trigPin 5  // attach pin GPIO5 ESP32 to pin Trig of JSN-SR04
long lvl_duration;     // Time taken for the pulse to reach the receiver
int lvl_distance;

// Flow Parameter
#define flw_pin 27
long flw_currentMillis = 0;
long flw_previousMillis = 0;
int flw_interval = 1000;
boolean flw_ledState = LOW;
float flw_calibrationFactor = 4.5;
volatile byte flw_pulseCount;
byte flw_pulse1Sec = 0;
float flw_flowRate;
unsigned int flw_flowMilliLitres;
unsigned long flw_totalMilliLitres;


// Initialize Methods
void getPower();
void getLevel();
void getFlow();
bool calculateRelay(void *);
bool collectingData(void *);
bool wifiStatusBlink(void *);
bool sendData(void *);
bool DEBUG_PARAMETER(void *);
void IRAM_ATTR flw_pulseCounter();

void setup()
{
  Serial.begin(115200);

  delay(5000);

  WiFi.begin(ssid, password);

  pzem.resetEnergy();

  pinMode(LED_BUILTIN, OUTPUT);

  pinMode(rly_pin, OUTPUT);
  pinMode(flw_pin, INPUT_PULLUP);

  pinMode(lvl_trigPin, OUTPUT);
  pinMode(lvl_echoPin, INPUT);

  flw_pulseCount = 0;
  flw_flowRate = 0.0;
  flw_flowMilliLitres = 0;
  flw_totalMilliLitres = 0;
  flw_previousMillis = 0;

  attachInterrupt(digitalPinToInterrupt(flw_pin), flw_pulseCounter, FALLING);

  Serial.println("STARTING");

  delay(5000);

  timer.every(2000, collectingData);
  timer.every(200, calculateRelay);
  timer.every(500, wifiStatusBlink);
  timer.every(1000*60*10, sendData);
  timer.every(1000, DEBUG_PARAMETER);
}

void loop()
{
  timer.tick(); // tick the timer
}

void getPower()
{
  pwr_voltage = pzem.voltage();
  pwr_current = pzem.current();
  pwr_power = pzem.power();
  pwr_energy = pzem.energy();
  pwr_frequency = pzem.frequency();
  pwr_pf = pzem.pf();

  if(isnan(pwr_power)) pwr_power = 0;
}

void getLevel()
{
  digitalWrite(lvl_trigPin, LOW);
  delayMicroseconds(2);

  digitalWrite(lvl_trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(lvl_trigPin, LOW);

  lvl_duration = pulseIn(lvl_echoPin, HIGH);
  lvl_distance = lvl_duration * 0.0344 / 2;
}

void getFlow()
{
  flw_currentMillis = millis();
  if (flw_currentMillis - flw_previousMillis > flw_interval) {
    
    flw_pulse1Sec = flw_pulseCount;
    flw_pulseCount = 0;

    // Because this loop may not complete in exactly 1 second intervals we calculate
    // the number of milliseconds that have passed since the last execution and use
    // that to scale the output. We also apply the calibrationFactor to scale the output
    // based on the number of pulses per second per units of measure (litres/minute in
    // this case) coming from the sensor.
    flw_flowRate = ((1000.0 / (millis() - flw_previousMillis)) * flw_pulse1Sec) / flw_calibrationFactor;
    flw_previousMillis = millis();

    // Divide the flow rate in litres/minute by 60 to determine how many litres have
    // passed through the sensor in this 1 second interval, then multiply by 1000 to
    // convert to millilitres.
    flw_flowMilliLitres = (flw_flowRate / 60) * 1000;

    // Add the millilitres passed in this second to the cumulative total
    flw_totalMilliLitres += flw_flowMilliLitres;
    
    // Print the flow rate for this second in litres / minute
    // Serial.print("Flow rate: ");
    // Serial.print(int(flowRate));  // Print the integer part of the variable
    // Serial.print("L/min");
    // Serial.print("\t");       // Print tab space

    // Print the cumulative total of litres flowed since starting
    // Serial.print("Output Liquid Quantity: ");
    // Serial.print(totalMilliLitres);
    // Serial.print("mL / ");
    // Serial.print(totalMilliLitres / 1000);
    // Serial.println("L");
  }
}

bool collectingData(void *)
{
  getFlow();
  getLevel();
  getPower();

  return true;
}

bool calculateRelay(void *)
{
  if (rly_state == 1)
  {
    if (lvl_distance < 20)
    {
      rly_state = 0;
    }
  }
  else
  {
    if (lvl_distance > 50)
    {
      rly_state = 1;
    }
  }

  if (rly_state)
  {
    digitalWrite(rly_pin, HIGH);
  }
  else
  {
    digitalWrite(rly_pin, LOW);
  }

  return true;
}

bool wifiStatusBlink(void *)
{
  if (WiFi.status() == WL_CONNECTED)
  {
    digitalWrite(LED_BUILTIN, HIGH);
  }
  else
  {
    Serial.print(".");
    digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));
  }

  return true;
}

bool sendData(void *)
{

  if (WiFi.status() == WL_CONNECTED)
  {
    Serial.println("SENDING");
    HTTPClient http;

    String serverPath = serverName + "?watt=" + pwr_power + "&level=" + lvl_distance + "&flow=" + flw_flowRate;

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

  return true;
}

bool DEBUG_PARAMETER(void *) {
  Serial.println("================");
  Serial.print("Power: "); Serial.print(pwr_power); Serial.println("W");
  Serial.print("Flow: "); Serial.print(int(flw_flowRate)); Serial.println(" L/min");
  Serial.print("Level: "); Serial.print(lvl_distance); Serial.println(" cm");

  return true;
}

void IRAM_ATTR flw_pulseCounter()
{
  flw_pulseCount++;
}
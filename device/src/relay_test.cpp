#include <Arduino.h>

#define rly_pin 22
int rly_state = 0;

void setup()
{

    pinMode(rly_pin, OUTPUT);
    pinMode(LED_BUILTIN, OUTPUT);
}

void loop()
{
    digitalWrite(rly_pin, HIGH);
    digitalWrite(LED_BUILTIN, HIGH);
    delay(1000);
    digitalWrite(rly_pin, LOW);
    digitalWrite(LED_BUILTIN, LOW);
    delay(1000);
}

// Arduino pin numbers
const int SW_pin = 2; // digital pin connected to switch output
const int buzzer = 9;
int incomingByte;

void setup() {
  pinMode(SW_pin, INPUT);
  pinMode(buzzer, OUTPUT);
  digitalWrite(SW_pin, HIGH);
  Serial.begin(9600);
}

void loop() {
  if (Serial.available() > 0)
  {
    // read the oldest byte in the serial buffer:
    incomingByte = Serial.read();
      if (incomingByte == 81)
      {
        tone(buzzer, 1000);
        delay(80);        
        noTone(buzzer);     
      }
      if (incomingByte == 87)
      {
        tone(buzzer, 1250);
        delay(80);        
        noTone(buzzer);     
      }
      if (incomingByte == 69)
      {
        tone(buzzer, 1500);
        delay(80);        
        noTone(buzzer);     
      }
      if (incomingByte == 82)
      {
        tone(buzzer, 1750);
        delay(80);        
        noTone(buzzer);     
      }
  }
  Serial.print(analogRead(A0));
  Serial.print(",");
  Serial.print(analogRead(A1));
  Serial.print(",");
  Serial.println(digitalRead(SW_pin));
  delay(33);
}

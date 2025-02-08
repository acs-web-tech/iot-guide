from machine import Pin
import network
import time
from umqtt.simple import MQTTClient
import random

# WiFi credentials
WIFI_SSID = "DINESH_WIFI"
WIFI_PASSWORD = "wifihome"

# MQTT broker details
MQTT_BROKER = "192.168.0.113"  # Replace with your broker's IP or hostname
MQTT_PORT = 1883
MQTT_TOPIC = b"room/temp"  # Topic to publish to
MQTT_CLIENT_ID = b"pico_w_client"
MQTT_USERNAME = b"pico_user"  # Username for authentication
MQTT_PASSWORD = b"secure_password"  # Password for authentication

# Connect to WiFi
def connect_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    if not wlan.isconnected():
        print("Connecting to WiFi...")
        wlan.connect(WIFI_SSID, WIFI_PASSWORD)
        while not wlan.isconnected():
            time.sleep(1)
    print("WiFi Connected!")
    print("IP Address:", wlan.ifconfig()[0])

# Publish a message to the MQTT broker
def publish_message():
    # Include username & password in MQTTClient
    client = MQTTClient(
        MQTT_CLIENT_ID,
        MQTT_BROKER,
        port=MQTT_PORT,
        user=MQTT_USERNAME,
        password=MQTT_PASSWORD
    )

    client.connect()
    print("Connected to MQTT Broker")

    try:
        while True:
            # Generate a random temperature between 20°C and 40°C
            temperature = random.uniform(20, 40)
            message = f"Temperature: {temperature:.2f} °C"
            client.publish(MQTT_TOPIC, message.encode())
            print(f"Message published to topic {MQTT_TOPIC}: {message}")

            # Wait for 5 seconds before sending the next temperature
            time.sleep(5)
    except KeyboardInterrupt:
        print("Stopping temperature sensor simulation...")
    finally:
        client.disconnect()
        print("Disconnected from MQTT Broker")

# Main program
try:
    connect_wifi()
    publish_message()
except Exception as e:
    print("Error:", e)

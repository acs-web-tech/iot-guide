from machine import Pin
import network
import time
from umqtt.simple import MQTTClient

# WiFi credentials
WIFI_SSID = "DINESH_WIFI"
WIFI_PASSWORD = "wifihome"

# MQTT broker details
MQTT_BROKER = "192.168.0.105"  # Replace with your broker's IP or hostname
MQTT_PORT = 1883
MQTT_TOPIC = b"test/topic"  # Topic to publish to
MQTT_CLIENT_ID = b"pico_w_client"

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
    client = MQTTClient(MQTT_CLIENT_ID, MQTT_BROKER, port=MQTT_PORT)
    client.connect()
    print("Connected to MQTT Broker")

    message = b"Hello from Raspberry Pi Pico W"
    client.publish(MQTT_TOPIC, message)
    print(f"Message published to topic {MQTT_TOPIC}")

    client.disconnect()
    print("Disconnected from MQTT Broker")

# Main program
try:
    connect_wifi()
    publish_message()
except Exception as e:
    print("Error:", e)

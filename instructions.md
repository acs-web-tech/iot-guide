# Avoiding TypeScript Compilation Errors

## Ignoring JavaScript Files in Git
To prevent committing `.js` files generated from TypeScript compilation, add the following to your `.gitignore`:

```
*.js
```

### Ignore JavaScript Files in Specific Folders
```
main/*.js
```
### Use `import * as` for Default Exports in CommonJS
If a package does not support default imports, use:
```ts
import * as somePackage from "some-package";
```
### CONNECTION ACKNOWLEDGEMENT (MQTT Packets) 
Contributers working on Packet Deserialization consider Enum response file(`Enums.ts`) on `arun-broker-function` branch and also check for updates in `server.ts` file


### Note: New libraries should not be used without approval, and the above method of import should only be used if the library supports for core functions. If needed, bring it up in the team discussion to further evaluate

---
 
# MQTT CONNECT Packet (0x10)

The `CONNECT` packet is used by the client to establish a connection to the broker. It is the first packet sent after the TCP connection is established.

## Hex Representation:
0x10, 0x14, 0x00, 0x04, 0x4D, 0x51, 0x54, 0x54, 0x04, 0x02, 0x00, 0x3C, 0x00, 0x00


## Breakdown:
- **0x10**: Fixed header byte. The first nibble `0x1` indicates it's a `CONNECT` packet
  
- **0x14**: Remaining Length (20 bytes). This indicates the total number of bytes in the packet after the fixed header.
  
- **0x00, 0x04**: Protocol Name Length (2 bytes). The protocol used is MQTT, so the length is `0x04`, meaning the following 4 bytes represent the protocol name "MQTT".
  
- **0x4D, 0x51, 0x54, 0x54**: ASCII values for the string "MQTT" (the protocol name).
  
- **0x04**: Protocol Level (MQTT version 4). The version number of MQTT that the client supports, which is `0x04` for MQTT version 3.1.1.
  
- **0x02**: Connect Flags (1 byte). This byte is split as follows:
  - **Bit 0**: Reserved (set to 0)
  - **Bit 1**: Clean Session Flag (set to 1)
  - **Bit 2**: Will Flag (set to 0, meaning no Will message is present)
  - **Bit 3**: Will QoS (set to 0, since no Will message is sent)
  - **Bit 4**: Will Retain Flag (set to 0, as there is no Will message)
  - **Bit 5-7**: Reserved for future use (set to 0)

- **0x00, 0x3C**: Keep Alive Interval (2 bytes). This value indicates how long the client wants to remain connected without sending any message before the broker considers the connection to be dead. Here, it's set to 60 seconds (`0x00 0x3C`).

- **0x00, 0x00**: Payload (client ID). In this example, there is no client ID specified in the packet, so it is zeroed out (`0x00 0x00`).

## Final Explanation:
- The `CONNECT` packet is used to initiate a connection to the MQTT broker.
- The protocol version and flags (such as Clean Session) specify connection behaviors.
- The remaining length and the payload (such as the Keep Alive interval) complete the connection request.

# MQTT CONNACK Packet (0x20)

The CONNACK packet is sent by the broker in response to a client's connection request, indicating whether the connection was accepted or rejected.

## Hex Representation:
0x20, 0x02, 0x00, 0x00

## Breakdown:
- **0x20**: Fixed header byte. The first nibble `0x2` indicates it's a CONNACK packet.

- **0x02**: Remaining Length (2 bytes). This indicates the total number of bytes in the packet after the fixed header.

- **0x00**: Connection Acknowledgment (1 byte). This field indicates the connection status. A value of `0x00` means the connection was accepted.

- **0x00**: Return Code (1 byte). This field specifies the reason for the connection result. A value of `0x00` indicates a successful connection.

## Final Explanation  

- The `CONNACK` packet is sent by the broker to acknowledge the connection request from the client.
- The **Connection Acknowledgment** field indicates whether the connection was successful or not.
- The **Return Code** gives additional information, with `0x00` meaning the connection was accepted without any issues.



# MQTT PUBLISH Packet (0x30)

The PUBLISH packet is used by the client or broker to send a message to a topic.

## Hex Representation:
0x30, 0x0F, 0x00, 0x01, 0x01, 0x00, 0x04, 0x68, 0x65, 0x6C, 0x6C, 0x6F, 0x20, 0x57, 0x6F, 0x72, 0x6C, 0x64


## Breakdown:
- **0x30**: Fixed header byte. The first nibble `0x3` indicates it's a PUBLISH packet.
  
- **0x0F**: Remaining Length (15 bytes). This indicates the total number of bytes in the packet after the fixed header.

- **0x00, 0x01**: Topic Length (2 bytes). This value indicates the length of the topic string. In this example, the topic has a length of `0x01`, meaning the topic is 1 byte long.

- **0x01**: Topic Name (1 byte). The topic here is a single character: `1`.

- **0x00**: Packet Identifier (2 bytes). This is used for QoS level 1 and 2. Here, it’s zero as the packet uses QoS level 0.

- **0x04**: Payload length (4 bytes). This is the length of the message body (or payload), which is 4 bytes.

- **0x68, 0x65, 0x6C, 0x6C, 0x6F**: ASCII values for the string "hello" (the message).

- **0x20**: Retained Flag (set to 0 for non-retained message).

- **0x57, 0x6F, 0x72, 0x6C, 0x64**: ASCII values for the string "World" (additional message content).

## Final Explanation

- The `PUBLISH` packet is used to send a message to the MQTT broker.
- It contains the **Topic Name**, **Payload**, **QoS**, and **Retain Flag**.
- The **Packet Identifier** is included if QoS is 1 or 2, and the **Remaining Length** indicates the size of the packet.
  

# MQTT PUBACK Packet (0x40)

The PUBACK packet is sent by the receiver to acknowledge the receipt of a message that was sent using QoS level 1.

## Hex Representation:
0x40, 0x02, 0x00, 0x01


## Breakdown:
- **0x40**: Fixed header byte. The first nibble `0x4` indicates it's a PUBACK packet.
  
- **0x02**: Remaining Length (2 bytes). This indicates the total number of bytes in the packet after the fixed header.

- **0x00, 0x01**: Packet Identifier (2 bytes). This identifier corresponds to the message that the PUBACK is acknowledging.
  
 ## Final Explanation  

- The `PUBACK` packet is used to acknowledge the receipt of a message sent with QoS 1.
- It contains the **Packet Identifier** and ensures reliable delivery of the message.
- The **Remaining Length** indicates the size of the packet.

# MQTT SUBSCRIBE Packet (0x82)

The SUBSCRIBE packet is used by the client to subscribe to one or more topics on the broker.

## Hex Representation:
0x82, 0x10, 0x00, 0x01, 0x00, 0x0A, 0x00, 0x0B

## Breakdown:
- **0x82**: Fixed header byte. The first nibble `0x8` indicates it's a SUBSCRIBE packet, and the second nibble `0x2` indicates QoS level 1.

- **0x10**: Remaining Length (16 bytes). This indicates the total number of bytes in the packet after the fixed header.

- **0x00, 0x01**: Packet Identifier (2 bytes). This identifier is used to track the subscription request.

- **0x00, 0x0A**: Topic Filter (2 bytes). This is the first topic the client is subscribing to. It represents a topic name "topicA".

- **0x00, 0x0B**: QoS Level (1 byte). The client is requesting a QoS level 1 subscription for the topic.

## Final Explanation  

- The `SUBSCRIBE` packet allows the client to subscribe to one or more topics on the broker.
- It includes the **Packet Identifier** to uniquely identify the request.
- The **Topic Filters** are used to specify which topics to subscribe to, and the **QoS Level** defines the level of message delivery guarantees.


# MQTT UNSUBSCRIBE Packet (0xA2)

The UNSUBSCRIBE packet is used by the client to unsubscribe from one or more topics on the broker.

## Hex Representation:
0xA2, 0x0A, 0x00, 0x01, 0x00, 0x0A

## Breakdown:
- **0xA2**: Fixed header byte. The first nibble `0xA` indicates it's an UNSUBSCRIBE packet, and the second nibble `0x2` indicates QoS level 1.

- **0x0A**: Remaining Length (10 bytes). This indicates the total number of bytes in the packet after the fixed header.

- **0x00, 0x01**: Packet Identifier (2 bytes). This identifier is used to track the unsubscribe request.

- **0x00, 0x0A**: Topic Filter (2 bytes). This represents the topic the client wants to unsubscribe from, named "topicA".

## Final Explanation  

- The `UNSUBSCRIBE` packet is used to unsubscribe from one or more topics on the broker.
- It includes the **Packet Identifier** to uniquely identify the request.
- The **Topic Filters** specify which topics the client no longer wants to receive messages from.

# MQTT SUBACK Packet (0x90)

The SUBACK packet is sent by the broker to acknowledge the receipt of a SUBSCRIBE packet and to confirm the QoS level the client has been granted for the subscription.

## Hex Representation:
0x90, 0x03, 0x00, 0x01, 0x01

## Breakdown:
- **0x90**: Fixed header byte. The first nibble `0x9` indicates it's a SUBACK packet, and the second nibble `0x0` indicates QoS level 0.

- **0x03**: Remaining Length (3 bytes). This indicates the total number of bytes in the packet after the fixed header.

- **0x00, 0x01**: Packet Identifier (2 bytes). This identifier corresponds to the SUBSCRIBE request that is being acknowledged.

- **0x01**: Return Code (1 byte). This represents the QoS level granted to the client. In this case, QoS level 1 is granted for the subscription.

## Final Explanation  

- The `SUBACK` packet is used by the broker to acknowledge a `SUBSCRIBE` request.
- It contains the **Packet Identifier** to match the `SUBSCRIBE` request.
- The **Return Code** field confirms the QoS level granted for each topic the client subscribed to.

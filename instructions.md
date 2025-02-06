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
contributers working on packet deserialization consider Enum response file(Enums.ts) on arun-broker-function branch and also check for updates in server.ts file

##### Note: New libraries should not be used without approval, and the above method of import should only be used if the library supports for core functions. If needed, bring it up in the team discussion to further evaluate
 
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


# MQTT CONACK Packet(0x20)
  The CONNACK (Connection Acknowledgment) packet is sent by the MQTT broker in response to a CONNECT packet from a client. It indicates whether the connection was successful or if there was an error.

## Hex Representation
   0x20, 0x02, 0x00, 0x00

# Breakdown:
- **0x20**: 0x20 represents an MQTT CONNACK packet.

- **0x02**:Indicates that the next 2 bytes (Session Present + Return Code) form the actual CONNACK payload.

- **0x00**: Connect Acknowledge Flags:
     - **Bit 0**: No previous session exists
     - **Bit 1**: Previous session exists

- **0x00**: Return code.This byte represents whether the connection attempt was successful. Those types are:
     - **Bit 0**:Connection accepted
     - **Bit 1**:Connection Refused: Unacceptable Protocol Version 
     - **Bit 2**:Connection Refused: Identifier Rejected 
     - **Bit 3**:Connection Refused: Server Unavailable 
     - **Bit 4**:Connection Refused: Bad Username or Password
     - **Bit 5**:Connection Refused: Not Authorized

## Final Explaination:
  - The CONNACK packet is sent by the MQTT broker in response to a CONNECT packet from a client.
  - It confirms whether the connection was successful or if an error occurred.
   
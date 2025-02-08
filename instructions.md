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

### Breakdown of Fixed Fields in MQTT CONNECT Packet
## Fixed Header:

- **Packet Type**: 1 byte
- **Remaining Length**: 1 byte (or more depending on message size, here we assume 1 byte for simplicity)
- **Total for Fixed Header**: 1 byte + 1 byte = 2 bytes

## Variable Header:

**Protocol Name**:
- **Length**: 2 bytes
- **Value**: 4 bytes ("MQTT" is 4 bytes in UTF-8 encoding)
- **Total for Protocol Name**: 2 bytes (length) + 4 bytes (value) = 6 bytes

**Flags (Connect Flags)**:

- **Connect Flags**: 1 byte (this contains various flags like username/password, clean session, etc.)
- **Total for Connect Flags**: 1 byte

- **Keep Alive**: 2 bytes (16 bits)

- **Total for Keep Alive**: 2 bytes

## Client ID:

- **Length**: 2 bytes
- **Client ID value** (e.g., "mqttjs_bcc54698e"): 15 bytes (as per your example)
- **Total for Client ID**: 2 bytes (length) + 15 bytes (value) = 17 bytes

## Username:

- **Length**: 2 bytes
- **Username value (e.g., "arun")**: 4 bytes
- **Total for Username**: 2 bytes (length) + 4 bytes (value) = 6 bytes

## Password:

- **Length**: 2 bytes
- **Password value (e.g., "1234")**: 4 bytes
- **Total for Password**: 2 bytes (length) + 4 bytes (value) = 6 bytes

## Total Bytes Calculation:
- **Fixed Header**: 2 bytes
- **Protocol Name**: 6 bytes
- **Connect Flags**: 1 byte
- **Keep Alive**: 2 bytes
- **Client ID**: 17 bytes
- **Username**: 6 bytes
- **Password**: 6 bytes
## Total Bytes:
2 + 6 + 1 + 2 + 17 + 6 + 6 = 40 bytes

##### Note: New libraries should not be used without approval, and the above method of import should only be used if the library supports for core functions. If needed, bring it up in the team discussion to further evaluate

# Issues
## Issue1
The issue we encountered arises after the client establishes its initial connection and publishes a message. The client, after the successful publication, continuously attempts to reconnect in an 
infinite loop. This behavior occurs because the communication protocol between the server (broker) and the client is not properly handling the acknowledgment 
process.


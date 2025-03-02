//Import the mqtt library
const mqtt = require('mqtt');
//define the broker address
const brokerurl = "mqtt://192.168.1.4";
//define the topic where you want to publish the data
const topic = 'test/topic';
//create a client and connect it to broker
// creditails are just dummy
const client = mqtt.connect(brokerurl,{username: "arun",password:"1234",reconnectPeriod:50000,keepalive:50000});

client.on('connect', () => {
    console.log("Client is connected");

    //data to be published
    const message = Buffer.from("Hello, MQTT", "utf-8");
    //sending data to the topic\
   
    client.on("message",(packet)=>{
        console.log("packet recived",packet)
    })
    client.subscribe("test/topic",{qos:2},(err)=>{
        if(err){
        console.log(err)
       }
       console.log("subscribed ")
       client.publish(topic, message,{qos:2,retain:true},(err) => {
        console.log(err)
        if (!err) {
            console.log(`Message "${message}" published to topic "${topic}" `);
        }
        else {
            console.error("Failed to publish message", err);
        }
        //close the connection after publishing or sending
       
        //client.end();
    })
    })
    client.on("packetreceive",(event)=>{
        console.log(event)
    })
    client.on("packetsend",(event)=>{
        console.log(event)
    })
   
})

//Event handlers for errors
client.on('error', (err) => {
    console.error("Connection error:", err);
});

//Evenr handlers for disconnection
client.on('close', () => {
    console.log("Disconnected from server");
})


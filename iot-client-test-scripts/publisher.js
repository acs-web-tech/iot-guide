//import the mqtt library
const mqtt=require('mqtt');
//define the broker address 
const brokerurl='';
//define the client and connect it to broker
const client=mqtt.connect(brokerurl);

//conenction event listener
client.on('connect', ()=>{
    console.log("Publisher connected to the broker");

    //Publish to different topics
    client.publish('sensor/room1/temprature', '30C', {qos:0}, (err)=>{
      if(!err) console.log("Published to sensor/room1/temprature");
    });
    
    //Close the connection after publishing
    setTimeout(() => {
      client.end();
      console.log('Publisher disconnected');
    }, 2000);
});

//import the mqtt library
const mqtt=require('mqtt');
//define the broker url
const brokerurl='';
//create client and connect it to broker
const client=mqtt.connect(brokerurl);

client.on('connect',()=>{
      console.log('Subscriber connected to the client');
      
      //subscribe to topics using wildcards
      client.subscribe('sensor/+/temprature',(err)=>{
        if(!err) console.log("Subsribe to sensor/+/temprature");
      });
});

client.on('message', (topic,message)=>{
  console.log(`Received message on topic "${topic}": ${message}`);
})

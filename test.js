const fs = require('fs');
const mqtt = require('mqtt');

// Load certificates and keys
const caFile = fs.readFileSync('/home/admin/certs/AmazonRootCA1.pem');
const certFile = fs.readFileSync('/home/admin/certs/device.pem.crt');
const keyFile = fs.readFileSync('/home/admin/certs/private.pem.key');

// MQTT options including the SSL configuration
const options = {
  host: 'a3mwllq937a5i6-ats.iot.us-east-1.amazonaws.com',
  port: 8883,
  protocol: 'mqtts',
  ca: caFile,
  cert: certFile,
  key: keyFile
};

// Connect to the AWS IoT
const client = mqtt.connect(options);

client.on('connect', () => {
  console.log('Connected to AWS IoT');
  publishData();
});

client.on('error', (error) => {
  console.log('Connection failed:', error);
});

function publishData() {
  let ctr = 100;
  setInterval(() => {
    const msg = ctr;
    console.log(msg);
    client.publish('bloodSugar', JSON.stringify({ msg: msg }), { qos: 0, retain: false });
    ctr++;
  }, 5000);
}

//keep the Node.js process running even if the publishing function is idle
process.on('SIGINT', function() {
  console.log("Caught interrupt signal");
  client.end(true, () => {
    process.exit();
  });
});

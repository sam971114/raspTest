const fs = require('fs');
const mqtt = require('mqtt');

// Load your certificates and keys
const caFile = fs.readFileSync('keys/rootCA.pem');
const certFile = fs.readFileSync('keys/certificate.pem.crt');
const keyFile = fs.readFileSync('keys/private.pem.key');

// MQTT options including the SSL configuration
const options = {
  host: 'a3mwllq937a5i6-ats.iot.ap-northeast-2.amazonaws.com',
  port: 8883,
  protocol: 'mqtts',
  ca: caFile,
  cert: certFile,
  key: keyFile,
  rejectUnauthorized: false
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
  let ctr = 1;
  setInterval(() => {
    const msg = "Testing" + ctr;
    console.log(msg);
    client.publish('sdk/test/js', JSON.stringify({ msg: msg }), { qos: 0, retain: false });
    ctr++;
  }, 5000);
}

// This will keep the Node.js process running even if the publishing function is idle
process.on('SIGINT', function() {
  console.log("Caught interrupt signal");
  client.end(true, () => {
    process.exit();
  });
});

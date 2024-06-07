const fs = require('fs');
const mqtt = require('mqtt');

// Load your certificates and keys
const caFile = fs.readFileSync('./AWS_Things_key/rootCA.pem');
const certFile = fs.readFileSync('./AWS_Things_key/certificate.pem.crt');
const keyFile = fs.readFileSync('./AWS_Things_key/private.pem.key');
const deviceId = 'YOUR_DEVICE_ID_HERE';

// MQTT options including the SSL configuration
const options = {
  host: 'a3mwllq937a5i6-ats.iot.ap-northeast-2.amazonaws.com',
  port: 8883,
  protocol: 'mqtts',
  clientId: deviceId,
  ca: caFile,
  cert: certFile,
  key: keyFile,
  rejectUnauthorized: false
};

// Connect to the AWS IoT
const client = mqtt.connect(options);

client.on('connect', function () {
  console.log('Connected to AWS IoT Core');
  
  // 연결 성공 시, 특정 토픽에 메시지 발행
  client.publish(topic, 'Hello from Raspberry Pi!', {}, function () {
    console.log('Message sent to ' + topic);
    client.end(); // 메시지 발행 후 연결 종료
  });
});

client.on('error', function (error) {
  console.error('Connection failed:', error);
});
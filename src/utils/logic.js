const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const directoryPath = __basedir + "/resources/"

function generateRequestId() {
  return crypto.randomBytes(16).toString('hex');
}

function generateSecretString() {
  return crypto.randomBytes(20).toString('hex');
}

function encryptWithPublicKey(publicKey, secretString) {
  const bufferSecretString = Buffer.from(secretString, 'utf8');
  const encrypted = crypto.publicEncrypt(publicKey, bufferSecretString);
  return encrypted.toString('base64');
}

function registerOwnerAndVehicle(owner_info, vehicle_info) {
  const requestId = generateRequestId();
  const secretString = generateSecretString();
  const encryptedSecretKey = encryptWithPublicKey(owner_info.public_key, secretString);

  const dataToStore = {
    requestId,
    owner_info,
    vehicle_info,
    secretString,
  };

  const filePath = path.join(directoryPath, `${requestId}.txt`);
  fs.writeFileSync(filePath, JSON.stringify(dataToStore));

  return encryptedSecretKey;
}

function retrieveInfo(requestId, decryptedString) {
  const filePath = path.join(directoryPath, `${requestId}.txt`);

  if (!fs.existsSync(filePath)) {
    throw new Error('Request ID not found');
  }

  const dataFromFile = JSON.parse(fs.readFileSync(filePath));
  if (dataFromFile.secretString !== decryptedString) {
    return 'unauthorised key';
  }

  const ra_key = 'some_ra_key_value'; 
  return {
    owner_info: dataFromFile.owner_info,
    vehicle_info: dataFromFile.vehicle_info,
    ra_key,
  };
}

// Example usage:

// Sample owner_info and vehicle_info
// const owner_info = {
//   Name: 'John Doe',
//   Dob: '1980-01-01',
//   Phone_no: '1234567890',
//   public_key: 
// `-----BEGIN PUBLIC KEY-----
// MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDHappyx5eviSDz5NwCm2m4R2bx
// h34eogQN6IaxQ7Mohmux4r7A3p0XfyjiPs87gU+AVKGYDMOQsoG+gcDRe/A1FNha
// Vcw79zlurYk4S34gnfI+3/RqAJrAPjGyHSBu0/P8+kVuuH+Mjl8zIrpdIdqAxPXB
// fz7gz7wmmxX99txh1wIDAQAB
// -----END PUBLIC KEY-----`,
// };

// const vehicle_info = {
//   Manu_year: '2015',
//   Chassis_no: 'XYZ123456789',
//   model: 'Tesla Model S',
// };

// const encryptedSecretKey = registerOwnerAndVehicle(owner_info, vehicle_info);
// console.log('Encrypted Secret Key:', encryptedSecretKey);


// const request_id = '5191c3f01e752eef1c0ca6a2f76f6b69'; 
// const decryptedString = '725493be26e08afadd83b5bce37b474d146ba5a9'; 

// const result = retrieveInfo(request_id, decryptedString);
// console.log('Result:', result);

module.exports = {
    registerOwnerAndVehicle,
    retrieveInfo,
};
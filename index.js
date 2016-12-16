var admin = require("firebase-admin");
var ion_rpc = require("node-bitcoin-rpc");

var firebase_cert = require(proces.env.FIREBASE_CERT || "./firebase-cert.json");

// Initialize Firebase
var config = {
    credential: admin.credential.cert(firebase_cert),
    databaseURL: proces.env.FIREBASE_URL || "https://ion-monitor.firebaseio.com"
};

var fireapp = admin.initializeApp(config);

var db = fireapp.database();
var ref = db.ref();
var masternodesRef = ref.child("masternodes");

var host = proces.env.RPC_HOST      || "localhost";
var port = proces.env.RPC_PORT      || 59273;
var username = proces.env.RPC_USER  || 'user';
var pass = proces.env.RPC_PASS      || '';

ion_rpc.init(host, port, username, pass);

setInterval(function() {
    ion_rpc.call('masternode', ['list'], function (err, res) {
        if (err !== null) {
            console.log('I have an error :( ' + err + ' ' + res)
        } else {
            var list = Object.keys(res.result).map(function(v) {
               return [ip, port] = v.split(':')
            });

            var ref = masternodesRef.push({
                moment: Date.now(),
                count: list.length,
                list: list
            });

            console.log('Saved record for ' + list.length + ' masternodes');
        }
    })
}, 60 * 1000);
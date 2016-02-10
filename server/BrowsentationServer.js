'use strict';

let WebSocketServer = require('ws').Server;

// Class ----------------------------------------
function BrowsentationServer(port, username, password) {
	this.admin = null;
	this._events = {};
	this._port = port;
	this._username = username;
	this._password = password;
	this.needlessAuth = false;

	this.on('login', (client, data) => {
		console.log(data);
		if (this.admin !== null || typeof data !== 'object') {
			return;
		}
		if (data.username === this._username && data.password === this._password) {
			this.admin = client;
			client.addEventListener('close', () => {
				this.admin = null;
			});
			client.send(JSON.stringify({
				head: 'login'
			}));
		}
	});
	this.on('slide', (client, data) => {
		if (this.needlessAuth || client === this.admin) {
			this.wss.broadcast({
				head: 'slide',
				body: data
			});
		}
	});
}

BrowsentationServer.prototype.on = on;
BrowsentationServer.prototype.fire = fire;
BrowsentationServer.prototype.start = start;

// Implementation -------------------------------
function on(eventName, callback) {
	if (this._events[eventName] === undefined) {
		this._events[eventName] = [];
	}
	this._events[eventName].push(callback);
}

function fire(client, eventName, data) {
	let callbacks = this._events[eventName] || [];
	callbacks.forEach((callback) => {
		callback(client, data);
	});
}

function start(requireAuth) {
	this.needlessAuth = !requireAuth;
	this.wss = new WebSocketServer({port: this._port});

	this.wss.broadcast = (data) => {
		if (typeof data !== 'string') {
			data = JSON.stringify(data);
		}
		this.wss.clients.forEach((client) => {
			client.send(data);
		});
	};

	this.wss.on('connection', (ws) => {
		console.log('connection!!!!');
		this.fire('connection', ws);
		ws.on('message', (msg) => {
			try {
				let obj = JSON.parse(msg);
				let head = obj.head;
				let body = obj.body;
				if (!head || !body) {
					throw 'Invalid Message';
				}
				this.fire(ws, head, body);
			} catch(e) {
				console.log(e);
				ws.send(JSON.stringify('{message: "Invalid message"}'));
			}
		});
	});

}

// Exports --------------------------------------
module.exports = BrowsentationServer;



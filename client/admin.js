
window.addEventListener('WebComponentsReady', function() {
	'use strict';

	var app = document.getElementById('app');

	app.listen(app.$.connectButton, 'tap', 'connect');
	app.listen(app.$.loginButton, 'tap', 'login');

	app.loggedIn = false;
	app.connected = false;
	app.counter = 1;

	app.connect = function() {
		var url = this.$.urlForm.serialize().url;
		app.$.ws.url = url;
		app.$.ws.open();
		app.$.ws.ws.addEventListener('open', function() {
			app.connected = true;
			app.$.connect.classList.add('hidden');
			app.$.login.classList.remove('hidden');
		});
	};

	app.login = function() {
		var loginData = this.$.loginForm.serialize();
		app.$.ws.send({
			head: 'login',
			body: loginData
		});
	};

	app.prev = function() {
		if (this.counter <= 1) {
			return;
		}
		this.$.ws.send({
			head: 'slide',
			body: this.counter - 1
		});
	};
	app.next = function() {
		this.$.ws.send({
			head: 'slide',
			body: this.counter + 1
		});
	};

	app.websocketOnMessage = function(e, detail) {
		var data = detail.data;
		console.log(data);
		switch (data.head) {
			case 'login':
				this.loggedIn = true;
				break;
			case 'slide':
				this.counter = data.body;
				break;
		}
	};
});


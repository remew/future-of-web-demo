window.addEventListener('WebComponentsReady', function() {
	'use strict';

	var app = document.getElementById('app');
	app.counter = 1;

	app.$.ws.url = 'ws://192.168.1.11:8080';
	app.$.ws.open();
	app.websocketOnMessage = function(e, detail) {
		var data = detail.data;
		if (data.head === 'slide') {
			app.counter = data.body;
		}
	};

	window.addEventListener('click', function() {
		app.$.ws.send({
			head: 'slide',
			body: app.counter + 1
		});
	});

	window.app = app;
});


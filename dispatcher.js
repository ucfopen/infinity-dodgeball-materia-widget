Namespace('Dodgeball').Dispatcher = (function() {
	var callbacks = [];
	return {
		register: function(cb) {
			callbacks.push(cb);
		},
		dispatch: function(action) {
			console.log(action);
			callbacks.forEach(function(cb) {
				cb(action);
			});
		},
	};
})();


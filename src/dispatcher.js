Namespace('Dodgeball').Dispatcher = (function() {
	var callbacks = [];
	return {
		register: function(cb) {
			callbacks.push(cb);
		},
		dispatch: function(action) {
			callbacks.forEach(function(cb) {
				cb(action);
			});
		},
	};
})();


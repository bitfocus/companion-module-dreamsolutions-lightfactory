let instance_skel = require('../../instance_skel')

function instance(system, id, config) {
	let self = this

	// super-constructor
	instance_skel.apply(this, arguments)

	self.actions() // export actions

	return self
}

instance.prototype.updateConfig = function (config) {
	let self = this

	self.config = config
}
instance.prototype.init = function () {
	let self = this

	self.status(self.STATE_OK)
}

instance.prototype.config_fields = function () {
	let self = this
	return [
		{
			type: 'textinput',
			id: 'host',
			label: 'LightFactory IP',
			width: 8,
			regex: self.REGEX_IP,
		},
		{
			type: 'textinput',
			id: 'port',
			label: 'Receive Port in LightFactory',
			width: 4,
			regex: self.REGEX_PORT,
		},
	]
}

// When module gets deleted
instance.prototype.destroy = function () {
	let self = this
	self.debug('destroy')
}

instance.prototype.actions = function (system) {
	let self = this
	self.setActions({
		send_cue: {
			label: 'Go to a specific numbered cue',
			options: [
				{
					type: 'textinput',
					label: 'Cue Number',
					id: 'int',
					default: 0,
					regex: self.REGEX_SIGNED_NUMBER,
				},
			],
		},
		send_go: {
			label: 'Go to the next cue',
		},
		send_back: {
			label: 'Go to the previous cue',
		},
		send_stop: {
			label: 'Stop the currently running cue',
		},
		send_reset: {
			label: 'Reset to the beginning of the cue list',
		},
		send_shortcut: {
			label: 'Run a numbered shortcut',
			options: [
				{
					type: 'textinput',
					label: 'Shortcut Number',
					id: 'int',
					default: 0,
					regex: self.REGEX_SIGNED_NUMBER,
				},
			],
		},
	})
}

instance.prototype.action = function (action) {
	let self = this

	let args = null
	let path = ''

	self.debug('action: ', action)

	switch (action.action) {
		case 'send_cue':
			path = '/LightFactory/CUE'
			args = [parseInt(action.options.int)]
			break
		case 'send_shortcut':
			path = '/LightFactory/Shortcut'
			args = [parseInt(action.options.int)]
			break
		case 'send_go':
			path = '/LightFactory/CUE'
			args = ['GO']
			break
		case 'send_back':
			path = '/LightFactory/CUE'
			args = ['BACK']
			break
		case 'send_stop':
			path = '/LightFactory/CUE'
			args = ['STOP']
			break
		case 'send_reset':
			path = '/LightFactory/CUE'
			args = ['RESET']
			break

		default:
			break
	}

	if (args !== null) {
		self.debug('Sending OSC', self.config.host, self.config.port, path, args)
		self.oscSend(self.config.host, self.config.port, path, args)
	}
}

instance_skel.extendedBy(instance)
exports = module.exports = instance
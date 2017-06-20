var register = {};

register.validate = function() {
	var self = this;
	var params = {
		school: $('.form-control[name="schoolName"]')[0].value,
		teacher: $('.form-control[name="teacherName"]')[0].value,
		emailId: $('.form-control[name="email"]')[0].value,
		password: $('.form-control[name="password"]')[0].value,
	} 

	// Displaying an error message
	// self.displayErrorMessage('Invalid email id!')
	// Call this function if all input fields are valid
	// self.submit(params);
}

register.displayErrorMessage = function(str) {
	$('.error-message').text(str);
}

register.submit = function(params) {
	$.post('/api/register', params);
}
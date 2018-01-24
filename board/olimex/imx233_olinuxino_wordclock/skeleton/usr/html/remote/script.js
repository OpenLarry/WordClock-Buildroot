jQuery(document).ready(function($) {
	$('#messagemodal').on('shown.bs.modal', function() {
		$('#messagemodalok').focus();
	});
	function message(type, message) {
		$('#messagemodaltitle').text(type);
		if(type.toLowerCase() == 'error') type = 'Danger';
		$('#messagemodalbody').text(message).removeClass().addClass('alert alert-'+type.toLowerCase());
		$('#messagemodal').modal('show');
	}
	
	function send() {
		$.ajax({
			url: 'http://'+location.hostname+':8080/signal/'+$(this).data('signal'),
			type: 'POST',
			contentType: 'application/json',
			success: function() {
				
			},
			error: function(result) {
				message('Error',result.responseText);
			}
		});
	}
	
	$('.remote').click(send);
});

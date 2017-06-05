jQuery(document).ready(function($) {
	function send() {
		$.ajax({
			url: 'http://'+location.hostname+':8080/signal/'+$(this).data('signal'),
			type: 'POST',
			contentType: 'application/json',
			success: function() {
				
			},
			error: function(result) {
				alert(result.responseText);
			}
		});
	}
	
	$('.remote').click(send);
});

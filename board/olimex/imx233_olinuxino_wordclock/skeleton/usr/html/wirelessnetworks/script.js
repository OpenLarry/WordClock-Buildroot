jQuery(document).ready(function($) {
	function get() {
		$.ajax({
			url: 'http://'+location.hostname+':8080/wirelessnetworks',
			type: 'GET',
			success: function(result) {
				getScan();
				for(var id in result) {
					setNetwork(id, result[id]);
				}
			},
			error: function() {
				setTimeout(get, 1000);
			}
		});
	}
	
	function getScan() {
		$.ajax({
			url: 'http://'+location.hostname+':8080/wirelessnetworks/scan',
			type: 'GET',
			success: function(result) {
				$('#ssids').html('');
				for(var id in result) {
					$('<option />').attr('value',result[id].ssid).text(result[id].ssid).appendTo('#ssids');
				}
			},
			error: function() {
				setTimeout(getScan, 1000);
			}
		});
	}
	
	function edit() {
		var form = $(this).parent().parent().parent();
		var id = form.parent().parent().find('.id').text();
		
		var data = {};
		form.serializeArray().map(function(x){data[x.name] = x.value;});
		data.enabled = data.enabled == 'true';
		
		form.find('input, button').prop('disabled', true);
		
		$.ajax({
			url: 'http://'+location.hostname+':8080/wirelessnetworks/'+id,
			type: 'PUT',
			data: JSON.stringify(data),
			processData: false,
			contentType: 'application/json',
			success: function(result) {
			},
			error: function(result) {
				message('Error',result.responseText);
			},
			complete: function() {
				form.find('input, button').prop('disabled', false);
			}
		});
	}
	
	function remove() {
		var form = $(this).parent().parent().parent();
		var id = form.parent().parent().find('.id').text();
		
		form.find('input, button').prop('disabled', true);
		
		$.ajax({
			url: 'http://'+location.hostname+':8080/wirelessnetworks/'+id,
			type: 'DELETE',
			success: function(result) {
				$('#network-'+id).remove();
			},
			error: function(result) {
				message('Error',result.responseText);
			},
			complete: function() {
				form.find('input, button').prop('disabled', false);
			}
		});
	}
	
	function add() {
		var form = $(this).parent().parent().parent();
		
		var data = {};
		form.serializeArray().map(function(x){data[x.name] = x.value;});
		data.enabled = data.enabled == 'true';
		
		form.find('input, button').prop('disabled', true);
		
		$.ajax({
			url: 'http://'+location.hostname+':8080/wirelessnetworks',
			type: 'POST',
			data: JSON.stringify(data),
			processData: false,
			contentType: 'application/json',
			success: function(id) {
				setNetwork(id, data);
				form[0].reset();
			},
			error: function(result) {
				message('Error',result.responseText);
			},
			complete: function() {
				form.find('input, button').prop('disabled', false);
			}
		});
	}
	
	
	function setNetwork(id, network) {
		var elem = $('#network-'+id);
		if(elem.length == 0) {
			elem = $('#network').clone();
			elem.find('.edit').click(edit);
			elem.find('.remove').click(remove);
		}
			
		elem.attr('id','network-'+id);
		elem.find('.id').text(id);
		elem.find('.ssid').val(network.ssid);
		elem.find('.psk').val(network.psk);
		elem.find('.enabled').prop('checked',network.enabled);
		if(network.current) elem.find('.current').show();
		elem.show();
		elem.appendTo('#networks');
	}
	
	function reassociate() {
		$.ajax({
			url: 'http://'+location.hostname+':8080/wirelessnetworks/reassociate',
			type: 'POST',
			processData: false,
			contentType: 'application/json',
			success: function() {
				message('Success','Reassociation started. Please wait!');
			},
			error: function(result) {
				message('Error',result.responseText);
			}
		});
	}
	
	get();
	$('.add').click(add);
	$('#reassociate').click(reassociate);
	
	$('#messagemodal').on('shown.bs.modal', function() {
		$('#messagemodalok').focus();
	});
	function message(type, message) {
		$('#messagemodaltitle').text(type);
		if(type.toLowerCase() == 'error') type = 'Danger';
		$('#messagemodalbody').text(message).removeClass().addClass('alert alert-'+type.toLowerCase());
		$('#messagemodal').modal('show');
	}
});

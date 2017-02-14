jQuery(document).ready(function($) {
	$('#load').click(function() {
		$('#update_file').click();
	});
	
	$('#update_file').change(function(e) {
		readFiles(e.target.files);
		$('#file_form')[0].reset();
	});
	
	$.ajax({
		type: 'GET',
		url: 'http://'+location.hostname+':8080/systeminfo',
		success: function(r) {
			for(var id in r) {
				$('.'+id).text(r[id]);
			}
		}
	});
	
	var ajax;
	$('#cancel').click(function() {
		if(ajax) ajax.abort();
	});
	function readFiles(files) {
		var file = files[0];
		
		if(file.name.substr(-4) != ".img") {
			alert("Invalid file extension!");
			return;
		}
		if(file.size <= 13631488) {
			alert("File too small!");
			return;
		}
		if(file.size > 47185920) {
			alert("File too big!");
			return;
		}
		
		$('#load').prop('disabled', true);
		
		var data = new Uint8Array(4194304 + file.size - 13631488);
		var kernel = false;
		var rootfs = false;
		function upload() {
			if(kernel && rootfs) {
				kernel = false;
				rootfs = false;
				
				$('#progressbar').addClass('active');
				$('#progressbar').removeClass('progress-bar-success');
				$('#progressbar').removeClass('progress-bar-danger');
				ajax = $.ajax({
					type: 'POST',
					url: 'http://'+location.hostname+':8080/update',
					contentType: 'application/octet-stream',
					data: data,
					processData: false,
					success: function(r) {
						$('#progressbar').addClass('progress-bar-success');
						alert(r);
					},
					error: function(r) {
						$('#progressbar').addClass('progress-bar-danger');
						if(r.responseText) alert(r.responseText);
					},
					complete: function() {
						$('#progressbar').removeClass('active');
						$('#load').prop('disabled', false);
					},
					xhr: function() {
						var xhr = new window.XMLHttpRequest();
						xhr.upload.addEventListener("progress", function(evt) {
							if (evt.lengthComputable) {
								var percentComplete = evt.loaded / evt.total;
								$('#progressbar').css('width',percentComplete*100+"%");
							}
					   }, false);

					   return xhr;
					},
				});
			}
		}
		
		function getSlice(file, start, end, callback) {
			var blob;
			if (file.slice) {
				blob = file.slice(start, end);
			} else if (file.mozSlice) {
				blob = file.mozSlice(start, end);
			} else if (file.webkitSlice) {
				blob = file.webkitSlice(start, end);
			}
			var r = new FileReader();
			r.onload = callback;
			r.readAsArrayBuffer(blob);
		}
		
		getSlice(file, 3145728, 7340032, function(e) {
			data.set(new Uint8Array(e.target.result), 0);
			kernel = true;
			upload();
		});
		getSlice(file, 13631488, file.size, function(e) {
			data.set(new Uint8Array(e.target.result), 4194304);
			rootfs = true;
			upload();
		});
	}
});

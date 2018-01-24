jQuery(document).ready(function($) {
	function openWs() {
		var connection = new WebSocket('ws://'+location.hostname+':8080/lua-log', []);
		
		connection.onmessage = function(e) {
			$('#log').prepend(e.data.trim().split("\n").reverse().map(function(t) { return "<span>"+t+"<br></span>"; }).join(""));
			while($('#log span').length > 50) {
				$('#log span:last').remove();
			}
		};
		
		connection.onopen = function() {
			$('div.row').stop().fadeTo(500, 1);
		}
		
		connection.onclose = openWsDelay;
	}
	
	function openWsDelay(e) {
		$('div.row').stop().fadeTo(500, 0.3);
		setTimeout(function() {
			openWs();
		}, 2000);
	};
	
	openWs();
	
	var editor = ace.edit("editor");
	editor.getSession().setMode("ace/mode/lua");
	editor.setOption('maxLines',Infinity);
	editor.$blockScrolling = Infinity;
	editor.on('change', function() {
		changed = true;
	});
	
	var changed = false;
	
	function getLua() {
		$.ajax({
			url: 'http://'+location.hostname+':8080/lua',
			type: 'GET',
			success: function(result) {
				editor.setValue(result, -1);
				changed = false;
			},
			error: function() {
				setTimeout(getLua, 1000);
			}
		});
	}
	getLua();
	
	$(window).on('beforeunload', function() {
		if(changed) return 'Discard changes?';
	});
	
	$(document).on('keydown', function(e) {
		if(e.ctrlKey && e.keyCode == 83) {
			$('#save').click();
			return false;
		}else if(e.ctrlKey && e.keyCode == 76) {
			$('#load').click();
			return false;
		}
	});
	
	$('#messagemodal').on('shown.bs.modal', function() {
		$('#messagemodalok').focus();
	});
	function message(type, message) {
		$('#messagemodaltitle').text(type);
		if(type.toLowerCase() == 'error') type = 'Danger';
		$('#messagemodalbody').text(message).removeClass().addClass('alert alert-'+type.toLowerCase());
		$('#messagemodal').modal('show');
	}
	
	$('#save').click(function() {
		$.ajax({
			url: 'http://'+location.hostname+':8080/lua',
			type: 'PUT',
			data: editor.getValue(),
			success: function(result) {
				changed = false;
				message('Success','Lua saved!');
			},
			error: function(result) {
				message('Error',result.responseText);
			}
		});
	});
	$('#load').click(function() {
		if(!changed || confirm('Discard changes?')) {
			getLua();
		}
	});
	
	$('#export').click(function() {
		$(this).attr('href','data:application/octet-stream,' + encodeURIComponent(editor.getValue()));
	});
	$('#import').click(function() {
		$('#import_file').click();
	});
	
	// http://stackoverflow.com/questions/10261989/html5-javascript-drag-and-drop-file-from-external-window-windows-explorer
	var dropZone = $('body')[0];
	dropZone.addEventListener('dragover', function(e) {
		e.stopPropagation();
		e.preventDefault();
		e.dataTransfer.dropEffect = 'copy';
	});
	dropZone.addEventListener('drop', function(e) {
		e.stopPropagation();
		e.preventDefault();
		readFiles(e.dataTransfer.files);
	});
	
	$('#import_file').change(function(e) {
		readFiles(e.target.files);
		$('#file_form')[0].reset();
	});
	
	function readFiles(files) {
		for (var i = 0, f; file = files[i]; i++) {
			var reader = new FileReader();
			reader.onload = function(e2) { // finished reading file data.
				editor.setValue(e2.target.result, -1);
			}
			reader.readAsBinaryString(file); // start reading the file data.
			changed = true;
		}
	}
});

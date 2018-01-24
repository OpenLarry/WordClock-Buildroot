jQuery(document).ready(function($) {
	var editor = new JSONEditor($('#container')[0],{
		modes: ['tree','code'],
		onModeChange: function(n,o) {
			if(n=='code') editor.aceEditor.setOption('maxLines',Infinity);
		},
		onChange: function() {
			changed = true;
		},
		name: 'root'
	});
	var changed = false;
	
	function getSettings() {
		$.ajax({
			url: 'http://'+location.hostname+':8080/settings',
			type: 'GET',
			success: function(result) {
				editor.set(result);
				changed = false;
			},
			error: function() {
				setTimeout(getSettings, 1000);
			}
		});
	}
	getSettings();
	
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
			url: 'http://'+location.hostname+':8080/settings',
			type: 'PUT',
			data: JSON.stringify(editor.get()),
			contentType: 'application/json',
			dataType: 'json',
			success: function(result) {
				changed = false;
				message('Success','Settings saved!');
			},
			error: function(result) {
				message('Error',result.responseText);
			}
		});
	});
	$('#load').click(function() {
		if(!changed || confirm('Discard changes?')) {
			getSettings();
		}
	});
	
	$('#export').click(function() {
		$(this).attr('href','data:application/octet-stream,' + encodeURIComponent(JSON.stringify( editor.get(), null, '  ')));
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
				editor.set($.parseJSON(e2.target.result));
			}
			reader.readAsBinaryString(file); // start reading the file data.
			changed = true;
		}
	}
});

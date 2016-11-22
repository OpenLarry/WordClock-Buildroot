jQuery(document).ready(function($) {
	function openWs() {
		var connection = new WebSocket('ws://'+location.hostname+':8080/hwinfo', []);
		
		connection.onmessage = function(e) {
			$('div.row').stop().fadeTo(500, 1);
			
			var result = $.parseJSON(e.data);
		
			for(var g in result) {
				for(var i in result[g]) {
					var obj = result[g][i];
					
					if(typeof(obj['value']) == "boolean" && obj['value']) {
						$('#'+i+' .true').show();
						$('#'+i+' .false').hide();
					}else if(typeof(obj['value']) == "boolean" && !obj['value']) {
						$('#'+i+' .true').hide();
						$('#'+i+' .false').show();
					}else if(typeof(obj["median"]) == "number") {
						if(i == "brightness") {
							$('#'+i+' .progress-bar').css({ width: obj["median"]/33+"%"});
						}
						if(i == "temp") {
							obj["min"] = obj["min"]*1000;
							obj["max"] = obj["max"]*1000;
							obj["median"] = obj["median"]*1000;
						}
						obj["min"] = Math.round(obj["min"])/1000;
						obj["max"] = Math.round(obj["max"])/1000;
						obj["median"] = Math.round(obj["median"])/1000;
						$('#'+i+' .min-value').text(obj["min"]);
						$('#'+i+' .max-value').text(obj["max"]);
						$('#'+i+' .value').text(obj["median"]);
					}
				}
			}
		};
		
		connection.onclose = openWsDelay;
	}
	
	function openWsDelay(e) {
		$('div.row').stop().fadeTo(500, 0.3);
		setTimeout(function() {
			openWs();
		}, 2000);
	};
	
	openWs();
});

jQuery(document).ready(function($) {
	function openWs() {
		var connection = new WebSocket('ws://'+location.hostname+':8080/hwinfo', []);
		
		connection.onmessage = function(e) {
			$('div.row').stop().fadeTo(500, 1);
			
			var result = $.parseJSON(e.data);
			
			var rest = 0;
			var mem_p = 100;
			var mem_v = 0;
		
			for(var g in result) {
				for(var i in result[g]) {
					var obj = result[g][i];
					
					if(typeof(obj['value']) == "boolean" && obj['value']) {
						$('#'+i+' .true').show();
						$('#'+i+' .false').hide();
					}else if(typeof(obj['value']) == "boolean" && !obj['value']) {
						$('#'+i+' .true').hide();
						$('#'+i+' .false').show();
					}else{
						for(var v in obj) {
							var value_p = obj[v];
							var value_v = obj[v];
							
							if(i == "cpuload") {
								value_p *= 100;
								value_v *= 100;
							}
							
							if(i == "brightness")
								value_p /= 33;
							else if(v == "total")
								value_p = 100-(mem_p /= value_p);
							else if(v == "available")
								value_p = 100-(mem_p *= value_p);
							
							if(i == "temp") value_v *= 1000;
							if(["min","max","median","mean","total","available"].indexOf(v) >= 0) value_v = Math.round(value_v)/1000;
							if(["nice","irq","iowait"].indexOf(v) >= 0) value_v = rest += value_v;
							if(v == "total") value_v = mem_v += value_v;
							if(v == "available") value_v = mem_v -= value_v;
							if(["user","nice","system","idle","irq","softirq","iowait","total","available"].indexOf(v) >= 0) value_v = Math.round(value_v);
							
							
							$('#'+i+' .progress-bar.'+v).css({ width: value_p+"%"});
							$('#'+i+' .value.'+v).text(value_v);
						}
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

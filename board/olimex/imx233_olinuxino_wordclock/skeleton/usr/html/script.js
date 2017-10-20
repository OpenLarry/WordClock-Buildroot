jQuery(document).ready(function($) {
	
	function openWs() {
		var connection = new WebSocket('ws://'+location.hostname+':8080/livestream', []);
		
		connection.onmessage = function(e) {
			var reader = new FileReader();
			reader.addEventListener("loadend", function() {
				var result = new Uint8Array(reader.result);
				var i = 0;

				$('.led').each(function() {
					var r = result[i++]
					var g = result[i++]
					var b = result[i++]
					
					if($(this).hasClass("backlight")) {
						var brightness = Math.max(r,g,b) / 255.0;
						if(brightness > 0) {
							r /= brightness;
							g /= brightness;
							b /= brightness;
						}
						$(this).css('box-shadow', '0 0 2em 1em rgba(' +Math.round(r)+ ',' +Math.round(g)+ ',' +Math.round(b)+ ',' +brightness+ ')');
					}else{
						var r2 = r+Math.max((150-r-g-b),0)/3;
						var g2 = g+Math.max((150-r-g-b),0)/3;
						var b2 = b+Math.max((150-r-g-b),0)/3;
						r = Math.round(r2);
						g = Math.round(g2);
						b = Math.round(b2);
						$(this).css('color', 'rgb(' +r+ ',' +g+ ',' +b+ ')');
					}
				});
			});
			reader.readAsArrayBuffer(e.data);
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
});

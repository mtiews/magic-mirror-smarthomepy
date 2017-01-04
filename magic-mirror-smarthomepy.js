
 Module.register("magic-mirror-smarthomepy", {

	defaults: {
		host: 'localhost',
		port: '2121',
		items: []
	},

	start: function() {
        Log.info("Starting module: " + this.name);
		this.sendSocketNotification('CONFIG',this.config);
	},

	socketNotificationReceived: function(notification, payload){
        if (notification === 'DATA_RECEIVED'){
            if(payload){
                for (var i = 0; i < this.config.items.length; i++) {
                    if(payload.item == this.config.items[i].item) {
                        this.config.items[i].value = payload.value;
                    }
                }
                this.updateDom();
            }
        }
    },
	
	getDom: function() {
		var wrapper = document.createElement("table");
		wrapper.className = "small";
		Log.info('DOOOOOOOOOOOOOOM');
		for (var i = 0; i < this.config.items.length; i++) {
			var itemWrapper = document.createElement("tr");
			itemWrapper.className = "normal";
			
			var itemName =  document.createElement("td");
			itemName.innerHTML = this.config.items[i].name;
			itemName.className = "title bright";
			itemWrapper.appendChild(itemName);

			var itemValue =  document.createElement("td");
            if('unit' in this.config.items[i]) {
                itemValue.innerHTML = this.config.items[i].value + ' ' + this.config.items[i].unit;
            }
            else {
                itemValue.innerHTML = this.config.items[i].value;
            }
			itemValue.className = "light";
			itemWrapper.appendChild(itemValue);
			
			wrapper.appendChild(itemWrapper);
		}
		
        return wrapper;
	}
});

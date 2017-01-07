
Module.register("magic-mirror-smarthomepy", {

    defaults: {
        host: 'localhost',
        port: '2121',
        items: []
    },

    getStyles: function() {
        return ["magic-mirror-smarthomepy.css"];
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
        for (var i = 0; i < this.config.items.length; i++) {
            var itemWrapper = document.createElement("tr");
            itemWrapper.className = "normal";

            var itemName =  document.createElement("td");
            itemName.innerHTML = this.config.items[i].name;
            itemName.className = "dimmed mmsh-name";
            itemWrapper.appendChild(itemName);

            var itemValue =  document.createElement("td");
            var displayValue = this.config.items[i].value;
            if('formatFunction' in this.config.items[i] && typeof this.config.items[i].formatFunction === 'function') {
                displayValue = this.config.items[i].formatFunction(displayValue);
            }
            if('unit' in this.config.items[i]) {
                itemValue.innerHTML = displayValue + ' ' + this.config.items[i].unit;
            }
            else {
                itemValue.innerHTML = displayValue;
            }
            itemValue.className = "bright mmsh-value";
            itemWrapper.appendChild(itemValue);

            wrapper.appendChild(itemWrapper);
        }
        return wrapper;
    }
});

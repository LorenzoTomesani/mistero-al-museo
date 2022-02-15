function retrieveParValue(key) {
    var result = null,
    tmp = [];	
    var items = location.search.substr(1).split("&"); //["par1=value1,par2=value2, ... ,parN=valueN"] 
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("="); //["par1", "value1"] 
        if (tmp[0] === key){ 
			//vengono tolti tutti i caratteri di escape
			result = decodeURIComponent(tmp[1]);
		}
    }
    return result;
}
 
async function getJson(url){
	const json = await $.ajax({
        type: "Get",
        url: url,
        dataType: "json"
	})
	return json;
}
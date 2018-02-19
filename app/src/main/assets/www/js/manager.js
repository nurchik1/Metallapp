/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
document.getElementById("check-button").addEventListener("click", postData);
function postData(){
    cordovaHTTP.post("http://ahbasys.com/finans/tatu", {
        name: "nurchik",
        surname: "test"
    }, function(response) {
        // prints 200
        alert('Your comment was successfully added');
        console.log(response.status);
        try {
            response.data = JSON.parse(response.data);
            // prints test
            
            console.log(response.data.message);
        } catch(e) {
            console.error("JSON parsing error");
        }
    }, function(response) {
        // prints 403
        console.log(response.status);
      
        //prints Permission denied
        console.log(response.error);
    });
}
function getProduct() {
    $.get("http://ahbasys.com/finans/api/v1/product/region/"+window.localStorage.getItem('region_id')+"?token="+window.localStorage.getItem('token'), function(productcat, status){
        JSON.stringify(productcat); //to string
        var data = "";
                for (i = 0; i < productcat.length; i++) {
                    data += '<div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title">';
                    data += '<a data-toggle="collapse" href="#'+productcat[i].name+'">';
                    data += productcat[i].name;
                    data += '</a>';
                    data += '</h4></div>';
                    data += '<div id="'+productcat[i].name+'" class="panel-collapse collapse">';
                    data += '<table class="table table-striped table-hover table-bordered" id="sample_editable_1">';
                    data += '<thead><tr><th> Наименование </th><th> Ед. Изм. </th> <th> Остаток </th> <th> Прайс. цена </th>  <th> Цена </th> <th> Количество </th><th> Сумма </th></tr></thead>';
				    data += '<tbody>';
				    for (j = 0; j < productcat[i].products.length; j++) {
				    	data += '<tr class="odd gradeX package-row">';
	                    data += '<td class="center">';
	                    data += productcat[i].products[j].product_name;
	                    data += '</td>';
	                    data += '<td>';
	                    data += productcat[i].products[j].msb;
	                    data += '</td>';
	                    data += '<td>';
	                    data += productcat[i].products[j].quantity;
	                    data += '</td>';
	                    data += '<td>';
	                    data += productcat[i].products[j].price;
	                    data += '</td>';
	                    data += '<td>';
	                    data += '<input id = "product_price" type="number" class="form-control input-small check-null-price" name="price[]" min="'+ productcat[i].products[j].price +'" step="0.01" onkeyup="getValues()" onchange="getValues()">';
	                    data += '</td>';
	                    data += '<td>';
	                    data += '<input id = "product_quantity" type="number" class="form-control input-smally check-null-qty" name="qty[]" min="1" max="'+productcat[i].products[j].price+'" onkeyup="getValues()" onchange="getValues()">';
	                    data += '</td>';
	                    data += '<td name="product_sum" id="product_sum">';
	                    data += '</td>';
                        data += '<input type="hidden" name="product_id[]" value="'+productcat[i].products[j].id+'">';
	                    data += '</tr>';
				    }	
				    data +=  '</tbody>';      	
                    data += '</table>';	
                    data += '</div></div>';	
                }
                var twitter = document.getElementById("tsca");
                twitter.innerHTML = data;
    });
  }
  $('form').submit(function(){
    var price = $('input[name="price[]"]').map(function(){ 
        return this.value; 
    }).get();
    var qty = $('input[name="qty[]"]').map(function(){ 
        return this.value; 
    }).get();
    var product_id = $('input[name="product_id[]"]').map(function(){ 
        return this.value; 
    }).get();
    var logged_user = window.localstroage.getItem('user_id');
    var user_region = window.localstroage.getItem('region_id');

    $.ajax({
        type: 'POST',
        url: 'http://ahbasys.com/finans/api/v1/salegroup',
        headers: {
            'token' : window.localStorage.getItem('token')
        },
        data: {
            'price[]': price,
            'qty[]': qty,
            'product_id[]': product_id,
            'logged_user':logged_user,
            'user_region':user_region
        } ,
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (resp) {
          alert("success");
        },
        error: function (e) {
            alert("error");
        }
    });
    return false;
});
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        getProduct();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
    }    
   
};
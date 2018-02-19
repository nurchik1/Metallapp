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

function updateAmount(ish) {
    document.getElementById("total_amount").value = document.getElementById("total_amount_old").value - ish;
}

function updateAmount1(ish) {
    document.getElementById("amount2").value = document.getElementById("total_amount").value - ish;
}

function updateAmount2(ish) {
    document.getElementById("amount1").value = document.getElementById("total_amount").value - ish;
}

function catChange(selectObj) {
    // get the index of the selected option 
    var idx = selectObj.selectedIndex;
    // get the value of the selected option 
    var which = selectObj.options[idx].value;
    if (which != 6) {
        document.getElementById("expense_name").style.display = "none";
    } else {
        document.getElementById("expense_name").style.display = "block";
    }
}

function yesnoCheck() {
    if (document.getElementById('fu3').checked) {
        document.getElementById('fuflo').style.display = 'block';
    } else {
        document.getElementById('fuflo').style.display = 'none';
    }

}

function setTodaysDate() {
    var d = new Date();
    document.getElementById("fatura-head").innerHTML = "Расходная накладная N:" + window.localStorage.getItem('unique_id') + " от " + d.toDateString().substr(4, 11);
}

function getSaleInfo() {
    $.get("http://ahbasys.com/finans/api/v1/sale/confirm/" + window.localStorage.getItem('user_id') + "/" + window.localStorage.getItem('region_id') + "/" + window.localStorage.getItem('sale_group_id') + "?token=" + window.localStorage.getItem('token'), function (data, status) {
        var sales = data.sales;
        var salesTotal = data.sales_total.count;
        var saleGroup = data.salegroup;
        var customers = data.customers;
        JSON.stringify(data);
        var tdata = "";
        tdata += '<table class="table table-striped table-hover table-bordered" id="sample_editable_1">';
        tdata += '<tbody><tr><th>Покупатель</th><td><div class="col-md-8" id="list_customers"><div class="form-group"><select class="form-control" id="unique" name="unique" onchange="catChange(this);"><option value="6">Новый Клиент</option>';
        for (var i = 0; i < customers.length; i++) {
            tdata += '<option value="' + customers[i].customer + '">' + customers[i].customer + '</option>';
        }
        tdata += '</select></div></div><div class="col-md-6" id="expense_name"><div class="form-group"><div class="input-group"><span class="input-group-addon"><i class="fa fa-user"></i></span><input type="text" name="customers" id="customers" class="form-control"></div></div></div></td></tr>';
        tdata += '<tr><th>Способ оплаты</th><td><div class="form-group"><div class="col-md-9"><div class="mt-radio-inline"><input type="radio" name="check" value="1" checked onclick="yesnoCheck();" id="fu1"> Наличный <input type="radio" name="check" value="0" onclick="yesnoCheck();" id="fu2"> В долг<input type="radio" name="check" value="2" onclick="yesnoCheck();" id="fu3"> Наличный/Долг</div></div></div></td></tr><tr><th>Со скидкой</th><td><div class="form-group"><div class="col-md-9"><div class="mt-radio-inline"><input type="radio" name="sale" value="1" checked> Да <input type="radio" name="sale" value="0"> Нет </div> </div> </div></td> </tr><tr><th>Комментарий</th><td><textarea class="form-control" name="comment" rows="5" id="comment"></textarea></td></tr>';
        tdata += '</tbody>';
        tdata += '</table>';
        tdata += '<table class="table table-striped table-hover table-bordered" id="sample_editable_1">';
        tdata += '  <thead><tr><th> № </th><th> Товар </th><th> Количество </th><th> Цена </th><th> Сумма </th></tr></thead>';
        tdata += '<tbody>';
        for (var j = 0; j < sales.length; j++) {
            tdata += '<tr class="odd gradeX package-row">';
            tdata += '<td class="center">' + (j + 1) + '</td>';
            tdata += '<td>' + sales[j].product.product_name + '</td>';
            tdata += '<td>' + sales[j].qty + '</td>';
            tdata += '<td>' + sales[j].price + '</td>';
            tdata += '<td>' + (sales[j].qty * sales[j].price) + '</td>';
            tdata += '<input type="hidden" name="sale_id[]" value="' + sales[j].id + '">';
            tdata += '<input type="hidden" name="product_id[]" value="' + sales[j].product_id + '">';
            tdata += '<input type="hidden" name="qty[]" value="' + sales[j].qty + '">';
            tdata += '<input type="hidden" name="price[]" value="' + sales[j].price + '">';
            tdata += '</tr>';
        }
        tdata += '</tbody>';
        tdata += '</table>';
        tdata += '<input type="hidden" name="sg_id" id="sg_id" value="' + saleGroup.id + '">';
        tdata += '<div class="row"><div class="col-md-12"><div class="btn-group pull-right"><p><strong>Итого</strong>:' + salesTotal + ' сом</p><label>Скидка:</label><input type="number" min="0" max="' + salesTotal + '" name="discount" id="discount" value="0" step="0.01" onkeyup="updateAmount(this.value)" onchange="updateAmount(this.value)">  сом </div></div></div>';
        tdata += '<div class="row"><div class="col-md-12"><div class="btn-group pull-right" id="totalSale"><label>Всего ' + sales.length + ' наименований на сумму</label><input id="total_amount" type="text" name="total_amount" value="' + salesTotal + '" readonly="true"> сом <input id="total_amount_old" type="hidden" name="total_amount_old" value="' + salesTotal + '"></div></div></div>';
        document.getElementById('jstable').innerHTML = tdata;

    });
}

$('form').submit(function () {
    var unique = document.getElementById("unique").value;
    var customer = document.getElementById("customers").value;
    var check = $("input[name=check]:checked").val();
    var sale = $("input[name=sale]:checked").val();
    var comment = document.getElementById("comment").value;
    var discount = document.getElementById("discount").value;
    var amount1 = document.getElementById("amount1").value;
    var amount2 = document.getElementById("amount2").value;
    var total_amount = document.getElementById("total_amount").value;
    var sg_id = document.getElementById("sg_id").value;
    var region_id = window.localStorage.getItem('region_id');
    var saleId = $('input[name="sale_id[]"]').map(function () {
        return this.value;
    }).get();
    var productId = $('input[name="product_id[]"]').map(function () {
        return this.value;
    }).get();
    var qty = $('input[name="qty[]"]').map(function () {
        return this.value;
    }).get();

    $.ajax({
        type: 'POST',
        url: 'http://ahbasys.com/finans/api/v1/sale/confirm/approve?token=' + window.localStorage.getItem('token'),
        data: {
            "unique": unique,
            "customers": customer,
            "product_id": productId,
            "sale_id": saleId,
            "qty": qty,
            "check": check,
            "sale": sale,
            "discount": discount,
            "total_amount": total_amount,
            "comment": comment,
            "sg_id": sg_id,
            "region_id": region_id,
            "amount1": amount1,
            "amount2":amount2
        },
        success: function (resp) {
            alert("Продажа успешно прошла!");
            window.location.href = "manager.html";
        },
        error: function (e) {
            alert("Ошибка в продаже");
        }
    });
    return false;
});
document.getElementById("cancel").addEventListener("click", getDelete);
function getDelete(){
    event.preventDefault();
        $.get("http://ahbasys.com/finans/api/v1/cancel-sale/"+ window.localStorage.getItem('unique_id') +"?token=" + window.localStorage.getItem('token'), function (data, status) {
            var data2 = JSON.stringify(data);
            alert(data2);
    });
}
    


var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
        setTodaysDate();
        getSaleInfo();
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {}

};

document.getElementById("alert").addEventListener("click", dialogAlert);

function dialogAlert() {
    var message = "I am Alert Dialog!";
    var title = "ALERT";
    var buttonName = "Alert Button";
    navigator.notification.alert(message, alertCallback, title, buttonName);
    
    function alertCallback() {
       console.log("Alert is Dismissed!");
    }
 }
function postTest(){
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
$('form').submit(function(){
    var postData = $(this).serialize();
    $.ajax({
        type: 'POST',
        data: postData,
        url: 'http://ahbasys.com/finans/tatu',
        success: function(data){
            console.log(data);
            alert('Your comment was successfully added');
        },
        error: function(){
            console.log(data);
            alert('There was an error adding your comment');
        }
    });
    return false;
});
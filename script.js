//put date on the top of the page
var today = moment();
$("#currentDay").text(today.format("dddd, MMMM Do"));

var items = {
    "9": [],
    "10": [],
    "11": [],
    "12": [],
    "13": [],
    "14": [],
    "15": [],
    "16": [],
    "17": []
};

var setItems = function() {
    // store items in localStorage 
    localStorage.setItem("items", JSON.stringify(items));
    console.log(items);
}

var getItems = function() {
    
    var loadItems = JSON.parse(localStorage.getItem("items"));
    if (loadItems) {
        items = loadItems

        
        $.each(items, function(hour, items) {
            var hourDiv = $("#" + hour);
            createItems(items, hourDiv);
        })
    }


    auditItems();
}

var createItems = function(itemsText, hourDiv) {
    

    var itemsDiv = hourDiv.find(".items");
    var itemsP = $("<p>")
        .addClass("description")
        .text(itemsText)
    itemsDiv.html(itemsP);
}

var auditItems = function() {
    // change the background due to time of day

    var currentHour = moment().hour();
    $(".items-info").each( function() {
        var elementHour = parseInt($(this).attr("id"));

        // handle past, present, and future
        if ( elementHour < currentHour ) {
            $(this).removeClass(["present", "future"]).addClass("past");
        }
        else if ( elementHour === currentHour ) {
            $(this).removeClass(["past", "future"]).addClass("present");
        }
        else {
            $(this).removeClass(["past", "present"]).addClass("future");
        }
    })
};

var replaceTextarea = function(textareaElement) {
   
    var itemsInfo = textareaElement.closest(".items-info");
    var itemsArea = itemsInfo.find("textarea");

   
    var time = itemsInfo.attr("id");
    var text = itemsArea.val().trim();

    // persist information when the page is refreshed
    items[time] = [text];  
    setItems();

 
    createItems(text, itemsInfo);
}

$(".items").click(function() {

  
    $("textarea").each(function() {
        replaceTextarea($(this));
    })

    var time = $(this).closest(".items-info").attr("id");
    if (parseInt(time) >= moment().hour()) {

     
        var text = $(this).text();
        var textInput = $("<textarea>")
            .addClass("form-control")
            .val(text);

        
        $(this).html(textInput);
        textInput.trigger("focus");
    }
})



$(".saveBtn").click(function() {
    replaceTextarea($(this));
})

timeToHour = 3600000 - today.milliseconds();  
setTimeout(function() {
    setInterval(auditItems, 3600000)
}, timeToHour);

getItems();

bookList = [];

function getJsonObject(path, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success) success(JSON.parse(xhr.responseText));
            } else {
                if (error) error(xhr);
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
}

function mode_change(){
    var check = document.getElementById("check_mode");
    var mode = document.getElementById("change_mode");
    if(check.checked==true){
        mode.href = "dark_mode.css";
    }
    else if(check.checked == false){
        mode.href = "index.css";
    }

}

function select_book(){
    var select = document.getElementsByClassName("check");
    for(var i = 0; i<select.length; i++){
        if (select[i].checked==true){
            for(var j=0; j<select.length; j++){
                if(j!=i){
                    if(select[j].checked==true){
                        alert("you can only select one book");
                    }
                    select[j].checked=false;
                }
            }
        }
    }

}

function display_cart_num(total_num){
    var cart_book_num = document.getElementById("mode_select_cart");
        cart_book_num.innerHTML = "("+total_num+")";
}

var total_num = 0
function add_to_cart(){
    var select = document.getElementsByClassName("check");
    for(var j = 0; j<select.length; j++){
        if (select[j].checked==true){
            break;
        }
        if(j==select.length-1){
        alert("You need to select a book");
        }
    }
    for(var i = 0; i<select.length; i++){
        if (select[i].checked==true){
            var add_num = prompt("please enter quantity of the book");
            if(add_num==null || add_num=="" || isNaN(add_num)){
                alert("incorrect input");
                return;
            }
            total_num = total_num + parseInt(add_num);
            display_cart_num(total_num);
            if(parseInt(add_num)>0){
                var un_select = document.getElementsByClassName("check");
                for(var ij = 0; ij<un_select.length; ij++){
                    un_select[ij].checked=false;
                }
            }
        }
    }
}

function reset_cart(){
    var reset = confirm("Is it okay to reset the cart?");
    if(reset==true){
        total_num=0;
        display_cart_num(0);
    }
}



function no_duplicate(){
    var dup_obj = document.getElementsByTagName("tbody");
    var obj_count = dup_obj.length;
    if(obj_count===1){
        dup_obj[0].remove();
    }
}

var after_filter = [];
var after_search = [];

function loadBooks(json_data){
    no_duplicate();
    var listBox = document.getElementById("listBox");
    var tbody = document.createElement("tbody");
    var dark_mode = document.getElementById("check_mode");
    for (var i = 0; i < json_data.length; i++){
        var tr = document.createElement('tr');

        if(after_search.length!=[] && after_search.indexOf(json_data[i],0)!= -1){
            if(dark_mode.checked==true){
                tr.style.backgroundColor="#7C5148";
            }
            else if(dark_mode.checked==false){
                tr.style.backgroundColor="#e8fcbd";
            }
        }

        var td1 = document.createElement("td");
        var input = document.createElement("input");
        input.setAttribute("type","checkbox");
        input.setAttribute("class","check");
        input.setAttribute("onclick","select_book()");
        td1.appendChild(input);
        tr.appendChild(td1);

        var td2 = document.createElement("td");
        var img = document.createElement("img")
        img.setAttribute("src",json_data[i].img);
        img.setAttribute("width","80px");
        img.setAttribute("height","110px");
        td2.appendChild(img);
        tr.appendChild(td2);

        var td3 = document.createElement("td");
        td3.innerHTML = json_data[i].title;
        tr.appendChild(td3);

        var td4 = document.createElement("td");
        td4.setAttribute("width","100px");
        for (var m = 0; m < parseInt(json_data[i].rating); m++){
            var star = document.createElement("img");
            star.setAttribute("src", "images/star-16.ico");
            td4.appendChild(star);
        }
        for(var n = 0; n < 5-parseInt(json_data[i].rating); n++){
            var no_star = document.createElement("img");
            no_star.setAttribute("src","images/outline-star-16.ico");
            td4.appendChild(no_star);
        }
        tr.appendChild(td4);

        var td5 = document.createElement("td");
        td5.innerHTML = json_data[i].authors;
        tr.appendChild(td5);

        var td6 = document.createElement("td");
        td6.innerHTML = json_data[i].year;
        tr.appendChild(td6);

        var td7 = document.createElement("td");
        td7.innerHTML = json_data[i].price;
        tr.appendChild(td7);

        var td8 = document.createElement("td");
        td8.innerHTML = json_data[i].publisher;
        tr.appendChild(td8);

        var td9 = document.createElement("td");
        td9.innerHTML = json_data[i].category;
        tr.appendChild(td9);

        tbody.appendChild(tr);
    }
    listBox.children[1].appendChild(tbody); 

}

function SearchAndFilter(){
    var search_title = document.getElementById("search_val").value;
    var filter_title = document.getElementById("filter_val").value;
    after_filter = [];
    after_search = [];
    for(var j = 0; j < bookList.length; j++){
        if(search_title === "" && filter_title === "category"){
            after_filter.push(bookList[j]);
        }
        else if(search_title === "" && filter_title != "category"){
            if (bookList[j].category === filter_title){
                after_filter.push(bookList[j]);
            }
        }
        else if(search_title !="" && filter_title === "category"){
            if(bookList[j].title.toUpperCase().search(search_title.toUpperCase())!= -1 ){
                after_search.push(bookList[j]);
            }
            after_filter.push(bookList[j]);
        }
        else if (search_title!="" && filter_title != "category"){
            if(bookList[j].title.toUpperCase().search(search_title.toUpperCase())!= -1 && bookList[j].category ===filter_title ){
                after_search.push(bookList[j]);
                after_filter.push(bookList[j]);
            }
            else if (bookList[j].title.toUpperCase().search(search_title.toUpperCase())== -1 && bookList[j].category ===filter_title){
                after_filter.push(bookList[j]);
            }

        }

    }
    console.log(after_search);
    if(after_search.length == 0 && search_title != ""){
        alert("no book has been found");
    }
    loadBooks(after_filter);

}


window.onload = function() {

    getJsonObject("data.json",
        function(data) {
            bookList = data; 
            console.log(bookList); 
            loadBooks(bookList);
        },
        function(xhr) { console.error(xhr); }
    );
}

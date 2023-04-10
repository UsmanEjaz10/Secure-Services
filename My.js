var userSave = 0;

function resetCountryCity(){
    let countrybox = gid("countrybox");
    let citybox = gid("citybox");
    countrybox.innerHTML = "Select:";
    citybox.innerHTML = "Select:";
}


// Validating Admin Login Form
function validateAdminForm(){
    var username = gid("username").value;
    var password = gid("password").value;

    // Username + password recieved.
    console.log(username + " " + password);

    if(username == "") return false;
    if(password == "") return false;
    return SecurityManager.ValidateAdmin(username, password);
}

    var country;
    var city;

function check(id){
    let countryDropdown = gid("countryDropdown");
    countryDropdown.value = id;
    console.log(gid("countryDropdown").value);
    let c = SecurityManager.GetCountries();
    console.log(c);
    for(let x = 0; x<countries.length; x++){
        console.log(c[x]);
        if(c[x].CountryID == id){
            console.log("found id match" + c[x].CountryID);
            gid("countrybox").innerHTML=c[x].Name;
            gid("citybox").innerHTML = "Select";
        }
    }
    country = countryDropdown.value;
}

function checkcity(id){
    let cityDropdown = gid("cityDropDown");
    cityDropdown.value = id;
    console.log(cityDropdown.value);
    city = id;
    let cities = SecurityManager.GetAllCities();
    for(let i = 0; i<cities.length; i++){
        if(cities[i].CityID == id){
            gid("citybox").innerHTML = cities[i].Name;
        }
    }
}

function Citycheck(){
        let cities = SecurityManager.GetCitiesByCountryId(country);
        console.log("country selected with id = " + country);
        var ul = gid("citymenu");
        ul.innerHTML = "";
        for(var i = 0; i<cities.length; i++){
            let content = ul.innerHTML;
            ul.innerHTML= content + "<li><a class = 'dropdown-item' value = '"+ cities[i].CityID+"' onclick = 'return checkcity("+cities[i].CityID+")'>"+ cities[i].Name+"</a></li>";       
        }
}

function Save_user(){

    let login = gid("login").value;
    let password = gid("password").value;
    let name = gid("name").value;
    let email = gid("email").value;
    let countryDropdown = gid("countryDropdown").value;
    let cityDropDown = gid("cityDropDown").value;

    console.log(countryDropdown);
    console.log(cityDropDown);

    let error =  0;
     if(login == "") error = " Please enter login";
    else if(password == "") error = "Please enter password";
    else if(name == "") error = "Please enter name";
    else if(email == "") error = "Please enter email";
    else if(countryDropdown == undefined) error = "Please enter Country";
    else if(cityDropDown == undefined) error = "Please enter a City";


    if(error != 0){
        alertmsg( error);
        return false;
    }

    let id;
   
    if(userSave == 0){
        console.log("New user entered");
     id = null;
     let users = SecurityManager.GetAllUsers();
     for(let i = 0; i<users.length; i++){
         if(users[i].Login == login.value || users[i].Email == email.value){
             console.log("Not unique login or email");
             error = "Not unique Login or email!!";
             alertmsg(error);
             return false;
         }
     }
    }
    else{
        console.log("Already entered user");
        id = userSave;
        userSave = 0;
    }
   
    let user = {ID: id ,Name: name, Email: email, Country: countryDropdown, City: cityDropDown, Login: login, Password: password };
    console.log(error);
    

    
    return SecurityManager.SaveUser(user, successUserSave, errorUserSave );
   
    
}

function alertmsg(errormsg, id){
    const msg = `<div class="alert alert-warning alert-dismissible fade show" role="alert">
  <strong>`+ errormsg + `</strong>. 
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>`;
    console.log(id);
    let content = gid(id);
    content.innerHTML = msg;
}

function successUserSave(obj){
    let msg = "User has been saved with id: " + obj.ID + " and login: " + obj.Login;
    console.log(msg);
    sessionStorage.setItem('savesuccess', msg);
    return true;
}

function successdeleteUser(id){

    let msg = "User has been deleted with id: " + id;
    console.log("After window reloading");
    sessionStorage.setItem('delsuccess', msg); 
    return true;
    
}


function loadingUserTable(){
    Tablegenerator();
    if(sessionStorage.getItem('savesuccess')){
        let msg = sessionStorage.getItem('savesuccess');
        alertmsg(msg, "usermsg");
        sessionStorage.removeItem('savesuccess');
    }
    if(sessionStorage.getItem('delsuccess')){
        let msg = sessionStorage.getItem('delsuccess');
        alertmsg(msg, "usermsg");
        sessionStorage.removeItem('delsuccess');
    }
}


function errordeleteUser(stringmsg){
    let msg = "User cannot be deleted due to: "+ stringmsg;
    alertmsg(msg, "usermsg");
    return false;
}

function errorUserSave(stringmsg){
    console.log("Cannot save the user because of: "  + stringmsg);
    let msg = "User cannot " + stringmsg + " the user.";
    alertmsg(msg, "usermsg");
    return false;
}


function Tablegenerator(){
    let table = document.querySelector("table");
    let users = SecurityManager.GetAllUsers();
    let properties = ["ID","Name", "Email", "Edit", "Delete"];
    let thead = table.createTHead();
    let r = thead.insertRow();
    for(let i = 0; i<properties.length; i++){
        let th = document.createElement("th");
        let text = document.createTextNode(properties[i]);
        th.appendChild(text);
        r.appendChild(th);
    }
    for(let i = 0; i<users.length; i++){
        let row = table.insertRow();
        let idcell = row.insertCell();
        let namecell = row.insertCell();
        let emailcell = row.insertCell();
        let editcell = row.insertCell();
        let delcell = row.insertCell();

        let id = document.createTextNode(users[i].ID);
        let name = document.createTextNode(users[i].Name);
        let email = document.createTextNode(users[i].Email);
        
        let edit = document.createTextNode("Edit");
        const x = document.createElement("BUTTON");
        x.appendChild(edit);
        x.setAttribute('id' , users[i].ID);
        x.onclick = function(){
            editUser(users[i]);
        }
        console.log(x);  
      let del = document.createTextNode("Delete");
        let y = document.createElement("button");
        y.onclick= function(){
            var msg = confirm("Do you really want to delete" + users[i].Name);
            if(msg){
            SecurityManager.DeleteUser(users[i].ID, successdeleteUser, errordeleteUser);
            window.location.reload();
            }
        }
        y.appendChild(del);

        idcell.appendChild(id);
        namecell.appendChild(name);
        emailcell.appendChild(email);
        editcell.appendChild(x);
      //  editcell.onclick = editUser(users[i]);
      
        delcell.appendChild(y);
    }

}



function editUser(users){
    let login = gid("login");
    let password = gid("password");
    let name = gid("name");
    let email = gid("email");
    let countryDropdown = gid("countryDropdown");
    let cityDropDown = gid("cityDropDown");
    let citybox = gid("citybox");
    let countrybox = gid("countrybox");

    let id = users.ID;
    login.value = users.Login;
    password.value = users.Password;
    name.value = users.Name;
    email.value = users.Email;
    countryDropdown.value = users.Country;
    cityDropDown.value = users.City;
    let countryID;
    let allcountries = SecurityManager.GetCountries();
    console.log(allcountries);
    for(let i=0; i<allcountries.length; i++){
        console.log("Mactching..."+ allcountries[i].CountryID + " and " + users.Country);
        if(allcountries[i].CountryID == users.Country){
            countrybox.innerHTML = allcountries[i].Name;
            countryID = allcountries[i].CountryID;
            break;
        }
    }
    console.log(countryID + " matching with user city" + users.City);
    let allcities = SecurityManager.GetCitiesByCountryId(countryID);
    console.log(allcities);
    for(let i = 0; i<allcities.length; i++){
        console.log("matching ..."  + allcities[i].CityID + " with " + users.City);
        if(allcities[i].CityID == users.City){
            citybox.innerHTML = allcities[i].Name;
            break;
        }
    }


    userSave = users.ID;
    let user = {ID: id ,Name: name.value, Email: email.value, Country: countryDropdown.value, City: cityDropDown.value, Login: login.value, Password: password.value };
    console.log(user);
}






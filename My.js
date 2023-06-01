// useSave is a global variable that saves the id of a user which is to be edited //
var userSave = 0;

// Validating Admin Login Form
function validateAdminForm(){
    var username = gid("username").value;
    var password = gid("password").value;

    // Username + password recieved.
    console.log(username + " " + password);

    let error =0;   

    // Validation for empty fields //
    if(username == "") error = "Please enter username";
   else if(password == "") error = "Please enter password";
    
   if(error !=0){
    alertmsg(error, "uloginmsg");   // uloginmsg is the id of the div created on Login screen that displays error message //
    return false;
   }
   
   let a = SecurityManager.ValidateAdmin(username, password);
   console.log("Value recieved after validation" + a);
   
   if(a == false){  // Unsuccessful verification //
    error = "Invalid username or password for admin login";
    alertmsg(error, "uloginmsg");
    return false;
   }
   return true;
}

    var country;
    var city;


// Function is used to display the selected country by user. //
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
            gid("citybox").innerHTML = "Select:";
        }
    }
    country = countryDropdown.value;
}

// This function sets the value of dropdown to the value of the city selected (by id) //
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

// Displays the the available cities under the selected country //
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
    let val  = gid("email");
    console.log("country: "+countryDropdown);   // Debugging....//
    console.log("city: "+cityDropDown);

    let error =  0;
    
    console.log(val.value.match(/^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/));   

    // Empty fields validation.. //
     if(login == "") error = " Please enter login";
    else if(password == "") error = "Please enter password";
    else if(name == "") error = "Please enter name";
    else if(email == "") error = "Please enter email";
    else if(countryDropdown == undefined) error = "Please enter Country";
    else if(cityDropDown == undefined) error = "Please enter a City";
    else if(!val.value.match(/^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/)){error = "Please enter valid email address";}
    


    if(error != 0){
        alertmsg(error, "usermsg");
        return false;
    }

    let id;
   
    if(userSave == 0){      // usersave global variable helps us identifying that whether the user is new or not. 
        console.log("New user entered");
     id = null;
     let users = SecurityManager.GetAllUsers();
     console.log("users: "+users);
     for(let i = 0; i<users.length; i++){
         if(users[i].Login == login || users[i].Email == email){
             console.log("Not unique login or email");
             error = "Not unique Login or email!!";
             alertmsg(error, "usermsg");    // Displays an error message if the user is new but selecting a user login or email which is already entered //
             return false;
         }
     }
    }
    else{
        console.log("Already entered user");   // as userSave has a specific id of an object, it indicates that Edit function has been called //
        id = userSave;
        userSave = 0;
    }
   
    let user = {ID: id ,Name: name, Email: email, Country: countryDropdown, City: cityDropDown, Login: login, Password: password };
    console.log(error);
    
    return SecurityManager.SaveUser(user, successUserSave, errorUserSave );
   
    
}

// The most used function used to display alert messages on the occurence of different events //
function alertmsg(errormsg, id){
    const msg = `<div class="alert alert-warning alert-dismissible fade show" role="alert">
  <strong>`+ errormsg + `</strong>. 
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>`;
    console.log(id);
    let content = gid(id);
    content.innerHTML = msg;
}


// Success function displays successful message if user has been saved //
function successUserSave(obj){
    let msg = "User has been saved with id: " + obj.ID + " and login: " + obj.Login;
    console.log(msg);
    sessionStorage.setItem('savesuccess', msg);
    return true;
}

// Success function called if the user has been deleted successfully //
function successdeleteUser(id){

    let msg = "User has been deleted with id: " + id;
    console.log("After window reloading");
    sessionStorage.setItem('delsuccess', msg); 
    return true;
    
}

// Called at loading time, displays grid and any success message to be displayed //
function loadingUserTable(){    
    
    Tablegenerator();   // Used to generate a grid that displays already added users. //
    

    // Used sessionStorage to store success messages because after a successful event we have called .reload() function. So to success message to be displayed we need to store it in the session and remove it as it is displayed //
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

// Error messages displayed on unsuccessful deletion //
function errordeleteUser(stringmsg){
    let msg = "User cannot be deleted due to: "+ stringmsg;
    alertmsg(msg, "usermsg");
    return false;
}

// Error messages displayed on unsuccessful user save //
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

    // Creating the table header with the names mentioned in properties[] //
    let thead = table.createTHead();
    let r = thead.insertRow();
    for(let i = 0; i<properties.length; i++){
        let th = document.createElement("th");
        let text = document.createTextNode(properties[i]);
        th.appendChild(text);
        r.appendChild(th);
    }

    // Adding each row one by one //
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
            editUser(users[i]); // For every click edit function (below) is called //
        }
        console.log(x);  
      let del = document.createTextNode("Delete");
        let y = document.createElement("button");
        y.onclick= function(){
            var msg = confirm("Do you really want to delete" + users[i].Name);
            if(msg){
            SecurityManager.DeleteUser(users[i].ID, successdeleteUser, errordeleteUser); // Deletion function //
            window.location.reload(); // As you can see .reload() function is used to update the grid, sessionStorage comes in handy //
            }
        }
        y.appendChild(del);

        idcell.appendChild(id);
        namecell.appendChild(name);
        emailcell.appendChild(email);
        editcell.appendChild(x);
      
        delcell.appendChild(y);
    }

}


// The function gets called when the user clicks on Edit button //
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


    userSave = users.ID;    // here userSave gets the id of object which will help us identifying that this is not a new user //
    let user = {ID: id ,Name: name.value, Email: email.value, Country: countryDropdown.value, City: cityDropDown.value, Login: login.value, Password: password.value };
    console.log(user);
}

// Simple function that resets the value of country and city //
function resetCountryCity(){
    let countrybox = gid("countrybox");
    let citybox = gid("citybox");
    countrybox.innerHTML = "Select:";
    citybox.innerHTML = "Select:";
}





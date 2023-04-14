var roleassigned;   // Helps us displaying each role only once in html //

function validateUserForm(){
    var userlogin = gid("userlogin").value;
    var userpassword = gid("userpassword").value;

    // Username + password recieved.
    console.log(userlogin + " " + userpassword);

    let error = 0;
    
    if(userlogin == "") error = "Please enter username";
   else if(userpassword == "") error = "Please enter password";

    if(error !=0){
        alertmsg(error, "uloginmsg");
        return false;
    }

    console.log("both fields not empty");       // debugging. Means at this stage none of the fields are empty //
    let users = SecurityManager.GetAllUsers();  // Getting al the users from localStorage //
    console.log(users);
    console.log(users.length);
    for(let i =0; i<users.length; i++){
        console.log(users[i]);
        if(users[i].Login == userlogin && users[i].Password == userpassword){   // Comparing userLogins and Passwords //
            sessionStorage.setItem("login", userlogin); // On successfull login validation, save the userLogin in sessionStorage because username is to be displayed on UserHome.html in welcome() function //
            console.log("item set in session");
            return true;
        }
    }
    // If reached at this stage means that none of the logins matched so display error message //
    error = "Invalid username or password";
    alertmsg(error, "uloginmsg");
    return false;
}


// The function displays a welcome message to the logged in user and displays the role assigned to him/her. It allows displays all the permission granted for that specific role. //
function welcome(){

    let login = sessionStorage.getItem("login");        // Getting the userlogin from session to be displayed at welcome message //
    console.log("Starting" + login);
    
    let userrole = SecurityManager.GetAllUserRoles();
    let rolepermission = SecurityManager.GetAllRolePermissions();
    
    let b = document.body.innerHTML;        // Gives us the current html body //
    const welcome = `<div class="WelcomeUser"><h1>Welcome `+ login +` </h1></div>`;
    document.body.innerHTML = b + welcome;      // Added welcome message into the html body //
    
    console.log(userrole);
    console.log( rolepermission);
    
    for(let i=0; i<userrole.length; i++){
        console.log("trying to compare userlogin");
        if(userrole[i].User == login){          // Trying to compare userLogins so that all the roles for the logged in user can be identified //
           
            for(let j = 0; j<rolepermission.length; j++){
                if(roleassigned == rolepermission[j].Role) continue;    // This condition checks that if the role is already added into the html display message or not. //
                else if(rolepermission[j].Role == userrole[i].Role){
                    roleassigned = rolepermission[j].Role;      

                    console.log("User roles " + rolepermission.Role);
            
            const container = `<div class="hola"><h2>Role: `+userrole[i].Role+`</h2><p>Permission:</p>`;
            var permit = "";
           for(let k = 0; k<rolepermission.length; k++){        // Loop helps us display all the permissions for the specific role //
            if(rolepermission[j].Role == rolepermission[k].Role){
                console.log("Permission matched are: " + rolepermission[k].Permission);
                permit = permit + `<p>`+ rolepermission[k].Permission+`</p>`;
            }
           }
           let body = document.body.innerHTML;
           document.body.innerHTML = body + container + permit + `</div>`;
                }
            }
        }
    }
}
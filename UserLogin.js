var roleassigned;

function validateUserForm(){
    var userlogin = gid("userlogin").value;
    var userpassword = gid("userpassword").value;

    // Username + password recieved.
    console.log(userlogin + " " + userpassword);

    if(userlogin == "") return false;
    if(userpassword == "") return false;

    console.log("both fields not empty");
    let users = SecurityManager.GetAllUsers();
    console.log(users);
    console.log(users.length);
    for(let i =0; i<users.length; i++){
        console.log(users[i]);
        if(users[i].Login == userlogin && users[i].Password == userpassword){
            sessionStorage.setItem("login", userlogin);
            console.log("item set in session");
            return true;
        }
    }
    return false;
}

function welcome(){
    let login = sessionStorage.getItem("login");
    console.log("Starting" + login);
    let userrole = SecurityManager.GetAllUserRoles();
    let rolepermission = SecurityManager.GetAllRolePermissions();
    let b = document.body.innerHTML;
    const welcome = `<div class="WelcomeUser"><h1>Welcome `+ login +` </h1></div>`;
    document.body.innerHTML = b + welcome;
    console.log(userrole);
    console.log( rolepermission);
    for(let i=0; i<userrole.length; i++){
        console.log("trying to compare userlogin");
        if(userrole[i].User == login){
            console.log("login = " + login + " vs userrole = "+ userrole[i].User); 
            console.log("Role:" + userrole[i].Role)
            for(let j = 0; j<rolepermission.length; j++){
                if(roleassigned == rolepermission[j].Role) continue;
                else if(rolepermission[j].Role == userrole[i].Role){
                    roleassigned = rolepermission[j].Role;
                    console.log("User roles " + rolepermission.Role);
            const container = `<div class="hola"><h2>Role:`+userrole[i].Role+`</h2><p>Permission:</p>`;
            var permit = "";
           for(let k = 0; k<rolepermission.length; k++){
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
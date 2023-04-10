var UR=0;

function checkUser(){
    let users = SecurityManager.GetAllUsers();
        var ul = gid("usermenu");
        ul.innerHTML = "";
        for(var i = 0; i<users.length; i++){
            let content = ul.innerHTML;
            ul.innerHTML= content + "<li><a class = 'dropdown-item' value = '"+ users[i].ID+"' onclick = 'return userDrop("+users[i].ID+")'>"+ users[i].Login+"</a></li>";       
        }
}

function userDrop(id){
    let userDropDown = gid("userDropDown");
    userDropDown.value = id;
    let userlogin = SecurityManager.GetUserById(id);
    gid("userbox").innerHTML = userlogin.Login;
    console.log("Selected user id = " + userDropDown.value);
}

function saveUR(){
    let userDropDown = gid("userDropDown");
    let roleDropDown = gid("roleDropDown");
    console.log(userDropDown.value + "--per----role-- " + roleDropDown.value);
    let role = SecurityManager.GetRoleById(roleDropDown.value);
    let user = SecurityManager.GetUserById(userDropDown.value);
    console.log(role.Name + " " + user.Name + "names should be here");
    let rp = SecurityManager.GetAllUserRoles();
    console.log(rp.length);
    for(let i = 0; i<rp.length; i++){
        if(rp[i].Role == role.Name ){
            console.log("comparing first " + rp[i].Role + " " + role.Name)
            if(rp[i].User == user.Login){
                console.log("comparing second " + rp[i].User + " " + user.Name);
            console.log("Same role user already added!!");
            window.location.reload();
            return false;
            }
        }
    }

    let id;
    if(UR == 0){
        id = null;
    }
    else{
        id = UR;
        UR=0;
    }
    let roleuser = {ID: id, User: user.Login, Role: role.Name};
    console.log(roleuser);
    return SecurityManager.SaveUserRole(roleuser, successUR, errorUR);
}

function URTable(){
    let table = document.querySelector("table");
    let ur = SecurityManager.GetAllUserRoles();

    let properties = ["ID" , "User", "Role", "Edit", "Delete"];
    let func = "deleteUR";
    let e_func = "editUR";
    console.log(ur);
    console.log(properties);
    createTable(table, ur, properties, e_func, func, successdeleteUR, errordeleteUR);
}

function EditUR(obj){
    let roleDropDown = gid("roleDropDown");
    let userDropDown = gid("userDropDown");
    let Role = gid("Rolebox");
    let User = gid("userbox");
    Role.innerHTML = obj.Role;
    User.innerHTML = obj.User;
    let roles = SecurityManager.GetAllRoles();
    let users = SecurityManager.GetAllUsers();
    console.log(roles);
    console.log(users);
    for(let i = 0; i<roles.length; i++){
        if(roles[i].Name == obj.Role){
            roleDropDown.value=roles[i].ID;
            console.log(roleDropDown.value + "role value set.");
        }
    }
    for(let i = 0; i<users.length;i++){
        if(users[i].Login == obj.User){
            userDropDown.value = users[i].ID;
            console.log("UserDD value set = " + userDropDown.value);
        }
    }
    UR = obj.ID;   
}


function successUR(obj){
    let msg = "User-Role has been granted with id: " + obj.ID + " and with role: " + obj.Role + " and user login: " + obj.User;
    console.log(msg);
    sessionStorage.setItem('saveUR', msg);
    return true;
}

function successdeleteUR(id){

    let msg = "User-Role has been canceled with id: " + id;
    console.log("After window reloading");
    sessionStorage.setItem('delUR', msg); 
    return true;
    
}

function errordeleteUR(stringmsg){
    let msg = "User-Role cannot be deleted due to: "+ stringmsg;
    alertmsg(msg, "URmsg");
    return false;
}

function errorUR(stringmsg){
    console.log("Cannot delete the user-role because of: "  + stringmsg);
    let msg = " Cannot save the user-role beacuse of " + stringmsg;
    alertmsg(msg, "URmsg");
    return false;
}

function loadingURTable(){
    URTable();
    if(sessionStorage.getItem('saveUR')){
        let msg = sessionStorage.getItem('saveUR');
        console.log(msg);
        alertmsg(msg, "URmsg");
        sessionStorage.removeItem('saveUR');
    }
    if(sessionStorage.getItem('delUR')){
        let msg = sessionStorage.getItem('delUR');
        console.log(msg);
        alertmsg(msg, "URmsg");
        sessionStorage.removeItem('delUR');
    }
}

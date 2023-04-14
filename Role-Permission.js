var RP = 0;
function checkRole(){
    let roles = SecurityManager.GetAllRoles();
        console.log("country selected with id = " + country);
        var ul = gid("rolemenu");
        ul.innerHTML = "";
        for(var i = 0; i<roles.length; i++){
            let content = ul.innerHTML;
            ul.innerHTML= content + "<li><a class = 'dropdown-item' value = '"+ roles[i].ID+"' onclick = 'return roleDrop("+roles[i].ID+")'>"+ roles[i].Name+"</a></li>";       
        }
}

function checkPermission(){
    let permissions = SecurityManager.GetAllPermissions();
        var ul = gid("permissionmenu");
        ul.innerHTML = "";
        for(var i = 0; i<permissions.length; i++){
            let content = ul.innerHTML;
            ul.innerHTML= content + "<li><a class = 'dropdown-item' value = '"+ permissions[i].ID+"' onclick = 'return permissionDrop("+permissions[i].ID+")'>"+ permissions[i].Name+"</a></li>";       
        }
}

function permissionDrop(id){
    let permissionDropDown = gid("permissionDropDown");
    permissionDropDown.value = id;
    let permissionname = SecurityManager.GetPermissionById(id);
    gid("Permissionbox").innerHTML = permissionname.Name;
    console.log("Selected permission id = " + permissionDropDown.value);
}

function roleDrop(id){
    let roleDropDown = gid("roleDropDown");
    roleDropDown.value = id;
    let rolename = SecurityManager.GetRoleById(id);
    gid("Rolebox").innerHTML = rolename.Name;
    console.log(roleDropDown.value);
    console.log("Selected role id  = " + roleDropDown.value);
}

function saveRP(){
    let permissionDropDown = gid("permissionDropDown");
    let roleDropDown = gid("roleDropDown");

    let error=0;
    if(roleDropDown.value == undefined) error = "Please enter role";
    else if(permissionDropDown.value == undefined) error = "Please enter permission";

    if(error!=0){
        alertmsg(error, "RPmsg");
        return false;
    }

    console.log(permissionDropDown.value + "--per----role-- " + roleDropDown.value);
    let role = SecurityManager.GetRoleById(roleDropDown.value);
    let permission = SecurityManager.GetPermissionById(permissionDropDown.value);
    console.log(role.Name + " " + permission.Name + "names should be here");
    let rp = SecurityManager.GetAllRolePermissions();
    console.log(rp.length);
    for(let i = 0; i<rp.length; i++){
        if(rp[i].Role == role.Name ){
            console.log("comparing first " + rp[i].Role + " " + role.Name)
            if(rp[i].Permission == permission.Name){
            console.log("Same role permission already added!!");
            alertmsg("Same Role-Permission already added", "RPmsg");
            return false;
            }
        }
    }

    let id;
    if(RP == 0){
        id = null;
    }
    else{
        id = RP;
        RP=0;
    }
    let rolepermission = {ID: id, Role: role.Name, Permission: permission.Name};
    console.log(rolepermission);
    return SecurityManager.SaveRolePermission(rolepermission, successRP, errorRP);
}

function RPTable(){
    let table = document.querySelector("table");
    let rp = SecurityManager.GetAllRolePermissions();

    let properties = ["ID" , "Role", "Description", "Edit", "Delete"];
    let func = "deleteRP";
    let e_func = "editRP";
    console.log(rp);
    console.log(properties);
    createTable(table, rp, properties, e_func, func, successdeleteRP, errordeleteRP);
}

function EditRP(obj){
    let roleDropDown = gid("roleDropDown");
    let permissionDropDown = gid("permissionDropDown");
    let Role = gid("Rolebox");
    let Permission = gid("Permissionbox");
    Role.innerHTML = obj.Role;
    Permission.innerHTML = obj.Permission;
    let roles = SecurityManager.GetAllRoles();
    let permissions = SecurityManager.GetAllPermissions();
    console.log(roles);
    console.log(permissions);
    for(let i = 0; i<roles.length; i++){
        if(roles[i].Name == obj.Role){
            roleDropDown.value=roles[i].ID;
            console.log(roleDropDown.value + "role value set.");
        }
    }
    for(let i = 0; i<permissions.length;i++){
        if(permissions[i].Name == obj.Permission){
            permissionDropDown.value = permissions[i].ID;
            console.log(permissionDropDown.value + " permission value set.");
        }
    }
    RP = obj.ID;  
    
}


function successRP(obj){
    let msg = "Role-Permission has been granted with id: " + obj.ID + " and with role: " + obj.Role + " and permission: " + obj.Permission;
    console.log(msg);
    sessionStorage.setItem('saveRP', msg);
    return true;
}

function successdeleteRP(id){

    let msg = "Role-Permission has been canceled with id: " + id;
    console.log("After window reloading");
    sessionStorage.setItem('delRP', msg); 
    return true;
    
}

function errordeleteRP(stringmsg){
    let msg = "Role-Permission cannot be deleted due to: "+ stringmsg;
    alertmsg(msg, "RPmsg");
    return false;
}

function errorRP(stringmsg){
    console.log("Cannot delete the role-permission because of: "  + stringmsg);
    let msg = " Cannot save the role-permission beacuse of " + stringmsg;
    alertmsg(msg, "RPmsg");
    return false;
}

function loadingRPTable(){
    RPTable();
    if(sessionStorage.getItem('saveRP')){
        let msg = sessionStorage.getItem('saveRP');
        console.log(msg);
        alertmsg(msg, "RPmsg");
        sessionStorage.removeItem('saveRP');
    }
    if(sessionStorage.getItem('delRP')){
        let msg = sessionStorage.getItem('delRP');
        console.log(msg);
        alertmsg(msg, "RPmsg");
        sessionStorage.removeItem('delRP');
    }
}


function resetRolePermission(){
 
    let role = gid("Rolebox");
    let permission = gid("Permissionbox");
    role.innerHTML = "Select:";
    permission.innerHTML = "Select:";
}

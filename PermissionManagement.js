// Same as usersave, permissionSave helps us identifying the edit function //
var permissionsave = 0;

function savePermission(){
    let pname = gid("permissionname");
    let pdesc = gid("permissiondesc");
    console.log(pname.value + " " + pdesc.value);
    
    let error = 0;
    if(pname.value =="") error = "Please enter Permission name";
    else if(pdesc.value =="") error = "Please enter description";
    if(error!=0){
        alertmsg(error, "permissionmsg");
        return false;
    }

    let permissions = SecurityManager.GetAllPermissions();
    console.log(permissions)
    let id;
    if(permissionsave == 0){
        id = null;
        for(let i =0; i<permissions.length; i++){
            if(permissions[i].Name == pname.value){
                console.log("permission name already exists");
                alertmsg("Permission name already exists.", "permissionmsg"); // Displays error if permission name already exists in the grid //
                return false;
            }
        }
    }
    else{
        id = permissionsave;
        permissionsave = 0;
    }

    let permission = {ID: id, Name: pname.value, DESC: pdesc.value};
    console.log(permission);
    return SecurityManager.SavePermission(permission, successPermissionSave, errorPermissionSave);
}

function PermissionTable(){
    let table = document.querySelector("table");
    let permissions = SecurityManager.GetAllPermissions();

    let properties = ["ID" , "Name", "Description", "Edit", "Delete"];
    let func = "deletePermission";
    let e_func = "editPermission";
    console.log(permissions);
    console.log(properties);
    createTable(table, permissions, properties, e_func, func, successdeletePermission, errordeletePermission);
}

function successPermissionSave(obj){
    let msg = "Permission has been granted with id: " + obj.ID + " and name: " + obj.Name;
    console.log(msg);
    sessionStorage.setItem('savepermission', msg);
    return true;
}

function successdeletePermission(id){

    let msg = "Permission has been canceled with id: " + id;
    console.log("After window reloading");
    sessionStorage.setItem('delpermission', msg); 
    return true;
    
}

function errordeletePermission(stringmsg){
    let msg = "Permission cannot be deleted due to: "+ stringmsg;
    alertmsg(msg, "permissionmsg");
    return false;
}

function errorPermissionSave(stringmsg){
    console.log("Cannot delete the permission because of: "  + stringmsg);
    let msg = " Cannot save the permission beacuse of " + stringmsg;
    alertmsg(msg, "permissionmsg");
    return false;
}

function loadingPermissionTable(){
    PermissionTable();
    if(sessionStorage.getItem('savepermission')){
        let msg = sessionStorage.getItem('savepermission');
        console.log(msg);
        alertmsg(msg, "permissionmsg");
        sessionStorage.removeItem('savepermission');
    }
    if(sessionStorage.getItem('delpermission')){
        let msg = sessionStorage.getItem('delpermission');
        console.log(msg);
        alertmsg(msg, "permissionmsg");
        sessionStorage.removeItem('delpermission');
    }
}

function EditPermission(permission){
    let per = gid("permissionname");
    let desc = gid("permissiondesc");
    let id = permission.ID;
    permissionname.value = permission.Name;
    permissiondesc.value = permission.DESC;
    permissionsave = permission.ID;
  //  let r = {ID: id , Name: rolename.value, DESC: desc.value};

}


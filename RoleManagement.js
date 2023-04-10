var roleSave = 0;

function saveRole(){

    let rolename = gid("rolename");
    let desc = gid("desc");
    console.log(rolename.value + " " + desc.value);

    let error=0;

    if(rolename.value =="") error = "Please enter Role name.";
    else if(desc.value =="") error = "Please enter description.";

    if(error !=0){
        alertmsg(error, "rolemsg");
        return false;
    }

    let roles = SecurityManager.GetAllRoles();
    console.log(roles);
    

    let id;
    if(roleSave == 0){
        id = null;
        for(let i = 0; i<roles.length; i++){
            if(roles[i].Name == rolename.value){
                console.log("Role name already exists");
                return false;
            }
        }
    
    }
    else{
        id = roleSave;
        roleSave = 0;
    }

    let role = {ID: id, Name: rolename.value, DESC: desc.value};
    console.log(role);
    return SecurityManager.SaveRole(role, successRoleSave, errordeleteRole);
    
}


function createTable(table, object, properties, editfunction, funcType, delsuccess, delerror){

    TableHeader(table, properties);
    for(let i =0; i<object.length; i++){
        let row = table.insertRow();
        for(let j in object[i]){
                let cell = row.insertCell();
                let value = document.createTextNode(object[i][j]);
                console.log(object[i][j]);
                cell.appendChild(value);
        
        }
        let ecell = row.insertCell();
        let dcell = row.insertCell();
        let edit = document.createTextNode("Edit");
        const x = document.createElement("BUTTON");
        x.appendChild(edit);
        x.onclick = function(){
            identifier(object[i], editfunction);
        }
        console.log(x);  
      let del = document.createTextNode("Delete");
        let y = document.createElement("button");
        y.appendChild(del);
        y.onclick= function(){
            var msg = confirm("Do you really want to delete");
            if(msg){
            identifier(object[i], funcType, delsuccess, delerror);
            window.location.reload();
            }
    }
        dcell.appendChild(y);
        ecell.appendChild(x);
}
}

function identifier(obj, type, delsuccess, delerror){
    if(type == "deleteRole"){
        console.log(delsuccess);
        SecurityManager.DeleteRole(obj.ID, delsuccess, delerror);
    }
    else if(type == "editRole"){
        EditRole(obj);
    }
    else if(type == "deletePermission"){
        SecurityManager.DeletePermission(obj.ID, delsuccess, delerror);
    }
    else if(type == "editPermission"){
        EditPermission(obj);
    }
    else if(type == "deleteRP"){
        SecurityManager.DeleteRolePermission(obj.ID, delsuccess, delerror);
    }
    else if(type == "editRP"){
        EditRP(obj);
    }
    else if(type == "deleteUR")
    {
        SecurityManager.DeleteUserRole(obj.ID, delsuccess, delerror);
    }
    else if(type == "editUR"){
        EditUR(obj);
    }

}

function RoleTable(){
    let table = document.querySelector("table");
    let roles = SecurityManager.GetAllRoles();

    let properties = ["ID" , "Name", "Description", "Edit", "Delete"];
    let func = "deleteRole";
    let e_func = "editRole";
    console.log(roles);
    console.log(properties);
    createTable(table, roles, properties, e_func, func, successdeleteRole, errordeleteRole);
}

function EditRole(role){
    let rolename = gid("rolename");
    let desc = gid("desc");
    let id = role.ID;
    rolename.value = role.Name;
    desc.value = role.DESC;
    roleSave = role.ID;
  //  let r = {ID: id , Name: rolename.value, DESC: desc.value};

}

function TableHeader(table, properties){
    let thead = table.createTHead();
    let row = thead.insertRow();
    for(let i = 0; i<properties.length; i++){
        let th = document.createElement("th");
        let text = document.createTextNode(properties[i]);
        th.appendChild(text);
        row.appendChild(th);
    }

}


function successRoleSave(obj){
    let msg = "Role has been saved with id: " + obj.ID + " and name: " + obj.Name;
    console.log(msg);
    sessionStorage.setItem('saverole', msg);
    return true;
}

function successdeleteRole(id){

    let msg = "Role has been deleted with id: " + id;
    console.log("After window reloading");
    sessionStorage.setItem('delrole', msg); 
    return true;
    
}

function errordeleteRole(stringmsg){
    let msg = "Role cannot be deleted due to: "+ stringmsg;
    alertmsg(msg, "rolemsg");
    return false;
}

function errorRoleSave(stringmsg){
    console.log("Cannot delete the user because of: "  + stringmsg);
    let msg = " Cannot save the role beacuse of " + stringmsg;
    alertmsg(msg, "rolemsg");
    return false;
}

function loadingRoleTable(){
    RoleTable();
    if(sessionStorage.getItem('saverole')){
        let msg = sessionStorage.getItem('saverole');
        console.log(msg);
        alertmsg(msg, "rolemsg");
        sessionStorage.removeItem('saverole');
    }
    if(sessionStorage.getItem('delrole')){
        let msg = sessionStorage.getItem('delrole');
        console.log(msg);
        alertmsg(msg, "rolemsg");
        sessionStorage.removeItem('delrole');
    }
}
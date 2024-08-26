const taskInputEl = document.getElementById("task-input");
const taskInputBtn = document.getElementById("task-input-btn");
const taskDisplayConatiner = document.getElementById("task-display-container");

let taskID = 0;
let tasks = [];


document.addEventListener("DOMContentLoaded", function() {
    localCollect();
    displayTasks();
})

function displayTasks() {
    let tid,tdesc,istaskcomplete,iscompletetext,iscompleteclasstext,isDisabled;
    let todolist = document.createElement("li");
    taskDisplayConatiner.innerHTML = ""
    for (let i =0; i < tasks.length; i++){
        tid = tasks[i].id;
        tdesc = tasks[i].taskDesc;
        istaskcomplete = tasks[i].isCompleted;
        iscompletetext = istaskcomplete ? "checked":"";
        iscompleteclasstext = istaskcomplete ? "completed":"incomplete";
        isDisabled = istaskcomplete ? "text-muted list-group-item-dark":"";
        todolist = `<li class="task  ${isDisabled}" id="task-${tid}">
                        
                        <div class="task-status">
                            <input type="checkbox" class="checkbox-task  mark-${istaskcomplete}" name="mark-${tid}" id="mark-${tid}" onclick="marker(${i})" ${iscompletetext}>
                            <label for="mark-${tid}">${iscompleteclasstext}</label><br>
                        </div>
                        <div class="task-details-div">
                            <p>${tdesc}</p>
                        </div>
                        
                        <div class="edit-this-btn icons" onclick="editTask(${i}, this)">
                            <i class="fa-sharp fa-solid fa-pen-to-square"></i>
                        </div>
                        <div class="delete-this-btn icons" onclick="removeTask(${i})">
                            <i class="fa-solid fa-circle-minus" ></i>
                        </div>
                    </li>`;
        taskDisplayConatiner.innerHTML += todolist;
    }
}
function localCollect() {
    temptasks = JSON.parse(localStorage.getItem("tasks"));
    temptaskID = JSON.parse(localStorage.getItem("taskID"));

    if (temptasks != null && temptaskID != null){
        tasks = temptasks;
        taskID = temptaskID;
    } else {
        if (temptasks == null) {
            console.log("No tasks Found in local storage");
        }
        if (temptaskID == null) {
            console.log("No taskID  found in local storage");
        }
        tasks = [];
        taskID =0;
    }
    displayTasks();
}

function localSave() {
    localStorage.setItem("tasks",JSON.stringify(tasks));
    localStorage.setItem("taskID",JSON.stringify(taskID));
    localCollect();
}

function taskSave(inputValue){
    taskID++;
    tasks.unshift({
        id : taskID,
        taskDesc : inputValue,
        isCompleted : false
    });
    localSave();
}

function removeTask(i) {
    
    if (i === 'all') {
        localStorage.removeItem("tasks");
        localStorage.removeItem("tasks");
        localCollect()
    } else {
        let tid = tasks[i].id;
        tasks.splice(i , 1);
        console.log("deleted task of id ", tid);
        
        localSave();
    }
}

function editTask(i, btn) {
    let tid,tdesc,istaskcomplete,iscompletetext;
    const taskEl = btn.parentElement;
    taskEl.innerHTML = "";
    let editEl;  
    tid = tasks[i].id;
    tdesc = tasks[i].taskDesc;
    istaskcomplete = tasks[i].isCompleted;
    iscompletetext = istaskcomplete ? "checked":"";
    editEl = `
                    <label class="edit-task-input-label" for="task-${tid}-input">Edit your task and hit Save</label>
                    <input type="text" class="edit-task-input" id="task-${tid}-input" name="task-${tid}-input" value="${tdesc}" />
                    <div>
                        <input type="checkbox" class="edit-task-checkbox mark-${istaskcomplete}" id="task-${tid}-checkbox" name="task-${tid}-checkbox" value="" ${iscompletetext}>
                        <label class="edit-task-checkbox-label" for="task-${tid}-checkbox">Mark task as complete</label>
                    </div>
                    <div class="edit-save-btn " onclick="saveEditedTask(${i}, this)"><p>Save</p></div>
                
               `;
            
        
        
    taskEl.innerHTML = editEl;   
    taskEl.classList.replace("task","edit-task-input-row")
}

function saveEditedTask(i, btn) {
    let tid = tasks[i].id;
    let tdesc,istaskcomplete;
    const newInputEl = document.getElementById(`task-${tid}-input`);
    const newCheckEl = document.getElementById(`task-${tid}-checkbox`);
    tdesc = newInputEl.value;
    istaskcomplete = newCheckEl.checked;

    tasks[i].taskDesc = tdesc;
    tasks[i].isCompleted = istaskcomplete;
    if(istaskcomplete) {
        tasks.push(tasks.splice(i,1)[0]);
    } else {
        tasks.unshift(tasks.splice(i,1)[0]);
    }
    console.log("task mark updated id : ",tid);
    
    localSave();
}



function inputvalidator( inputValue ) {
    if(/^\s+$/.test(inputValue) || inputValue === ""){
        return false
    } 
    return true
}

taskInputBtn.addEventListener("click", function() {
    let inputValue = taskInputEl.value;
    if (inputvalidator( inputValue )) {
        taskSave(inputValue);
        displayTasks();
        taskInputEl.value = ""
    }
})


function marker(i){
    let tid = tasks[i].id;
    let istaskcomplete = document.getElementById(`mark-${tid}`).checked;

    tasks[i].isCompleted = istaskcomplete;

    if(istaskcomplete) {
        tasks.push(tasks.splice(i,1)[0]);
    } else {
        tasks.unshift(tasks.splice(i,1)[0]);
    }
    console.log("task mark updated id : ",tid);

    localSave()
}
import { deleteProject, loadProjects, saveProjectToLocalStorage } from "./project_controller";
import { buildProjectsListPage } from "./projects_list_page";
import backIcon from './images/back.png';
import descIcon from './images/desc.png';
import { buildProjectPage } from "./project_page";

export function buildNewProjectPage() {
    const header = document.querySelector("header");
    if (header.classList.contains("header-no-back")) {
        header.classList.remove("header-no-back");
        header.classList.add("header-with-back");
    }
    header.textContent = "";
    const h1 = document.createElement("h1");
    h1.textContent = "New Project";

    const backButton = document.createElement("button");
    backButton.classList.add("back-button");

    backButton.addEventListener("click", () => {
        buildProjectsListPage();
    });

    const backImg = document.createElement("img");
    backImg.src = backIcon;
    backImg.classList.add("back-img");
    backButton.appendChild(backImg);

    header.appendChild(backButton);

    header.appendChild(h1);

    const content = document.querySelector("#content");
    content.textContent = "";

    content.appendChild(formManager());

};

export function formManager(index) {
    let edit;
    let project;

    if (index !== undefined) {
        project = loadProjects()[index];
        edit = true;
    } else edit = false;

    const form = document.createElement("form");
    form.id = "new-project-form";

    const inputsDiv = document.createElement("div");
    inputsDiv.id = "form-inputs-div";
    
    if (edit) {
        inputsDiv.appendChild(projectNameInput(edit, project));
        for (let i = 0; i < project.tasks.length; i++) {
            inputsDiv.appendChild(createTaskInput(edit, project.tasks[i]));
        }
    } else {
        inputsDiv.appendChild(projectNameInput());
        inputsDiv.appendChild(createTaskInput());
    }
    

    const addNewTaskInputButton = document.createElement("button");
    addNewTaskInputButton.type = "button";
    addNewTaskInputButton.textContent = "+";
    addNewTaskInputButton.id = "new-task-input-button";
    addNewTaskInputButton.addEventListener("click", () => inputsDiv.appendChild(createTaskInput()));

    form.appendChild(inputsDiv);
    form.appendChild(addNewTaskInputButton);

    const buttonsDiv = document.createElement("div");
    buttonsDiv.id = "buttons-div";

    const saveButton = document.createElement("button");
    saveButton.type = "submit";
    saveButton.textContent = "SAVE";
    saveButton.id = "save-button";

    buttonsDiv.appendChild(saveButton);

    form.appendChild(buttonsDiv);

    form.addEventListener("submit", (e) => { // !!!
        e.preventDefault();
        if (edit) {
            deleteProject(index);
            saveProjectToLocalStorage(form.elements, index);
            buildProjectPage(index);
        } else {
            saveProjectToLocalStorage(form.elements);
            buildProjectsListPage();
        }
    }) 

    return form;
}

function projectNameInput(edit, project) {
    const inputDiv = document.createElement("div");
    inputDiv.classList.add("project-name-input-div");
    const input = document.createElement("input");
    input.classList.add("text-input");
    input.tabIndex = 1;
    input.type = "text";
    input.placeholder = "Project name...";
    input.maxLength = 70;
    input.minLength = 1;
    input.required = true;
    input.name = "project_name";
    input.classList.add("new-project-input"); // !!!
    if (edit) input.value = project.name;

    const minDate = new Date().toJSON().slice(0, 10);

    const inputDate = document.createElement("input");
    inputDate.classList.add("date-input");
    inputDate.type = "date";
    inputDate.name = "project_date";
    inputDate.min = minDate;
    inputDate.classList.add("project-date"); // !!!
    if (edit) inputDate.value = project.deadline;

    inputDiv.appendChild(input);
    inputDiv.appendChild(inputDate);

    return inputDiv;
}

function createTaskInput(edit, task) {
    const inputDiv = document.createElement("div");
    inputDiv.classList.add("input-div");
    const input = document.createElement("input");
    input.classList.add("text-input");
    input.tabIndex = 1;
    input.type = "text";
    input.placeholder = "Task...";
    input.maxLength = 120;
    input.minLength = 1;
    input.required = true;
    input.name = "task_name";
    input.classList.add("new-task-input"); // !!!
    if (edit) input.value = task.name;
    
    const descriptionInput = document.createElement("textarea");
    descriptionInput.classList.add("description-input");
    descriptionInput.classList.add("hidden");
    descriptionInput.name = "task_desc";
    descriptionInput.placeholder = "Description..."; // !!!
    if (edit) descriptionInput.value = task.desc;

    descriptionInput.addEventListener("input", () => {
            descriptionInput.style.height = "auto";
            descriptionInput.style.height = descriptionInput.scrollHeight + "px";
    }, false);

    const descriptionButton = document.createElement("button");
    descriptionButton.classList.add("desc-button");
    descriptionButton.type = "button";
    
    const descriptionIcon = document.createElement("img");
    descriptionIcon.src = descIcon;
    descriptionIcon.classList.add("desc-icon");
    descriptionButton.appendChild(descriptionIcon);

    descriptionButton.addEventListener("click", () => {
        if (descriptionInput.classList.contains("hidden")) {
            descriptionInput.classList.remove("hidden");
            descriptionInput.classList.add("shown");
        } else {
            descriptionInput.classList.remove("shown");
            descriptionInput.classList.add("hidden");            
        }
    })

    const minDate = new Date().toJSON().slice(0, 10);

    const inputDate = document.createElement("input");
    inputDate.classList.add("date-input");
    inputDate.type = "date";
    inputDate.name = "task_date";
    inputDate.min = minDate; // !!!
    if (edit) inputDate.value = task.deadline;

    const prioritySelect = document.createElement("select");
    prioritySelect.classList.add("priority-select");
    prioritySelect.name = "task_prio";
    const selectOptions = ["low", "normal", "high"];

    for (let i = 0; i < selectOptions.length; i++) {
        let option = document.createElement("option");
        option.value = selectOptions[i];
        option.text = selectOptions[i];
        if ((!edit && selectOptions[i] == "normal") || (edit && selectOptions[i] == task.priority)) option.selected = true; // !!!
        prioritySelect.appendChild(option);
    }

    const removeTaskButton = document.createElement("button");
    removeTaskButton.type = "button";
    removeTaskButton.classList.add("remove-task-button");
    removeTaskButton.textContent = "X";

    removeTaskButton.addEventListener("click", () => {
        removeTaskButton.parentElement.remove();
    });

    const status = document.createElement("input");
    status.classList.add("hidden");
    status.type = "checkbox";
    status.name = "status";
    if (edit) status.checked = task.done;
    else status.checked = false;

    inputDiv.appendChild(input);
    inputDiv.appendChild(descriptionButton);
    inputDiv.appendChild(inputDate);
    inputDiv.appendChild(prioritySelect);
    inputDiv.appendChild(removeTaskButton);
    inputDiv.appendChild(descriptionInput);
    inputDiv.appendChild(status);

    return inputDiv;
}
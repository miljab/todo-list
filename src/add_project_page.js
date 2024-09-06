import { saveProjectToLocalStorage } from "./project_controller";
import { buildProjectsListPage } from "./projects_list_page";
import backIcon from './images/back.png';

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

function formManager() {
    const form = document.createElement("form");
    form.id = "new-project-form";

    const inputsDiv = document.createElement("div");
    inputsDiv.id = "form-inputs-div";
    
    inputsDiv.appendChild(projectNameInput());
    inputsDiv.appendChild(createTaskInput());

    const addNewTaskInputButton = document.createElement("button");
    addNewTaskInputButton.type = "button";
    addNewTaskInputButton.textContent = "+"
    addNewTaskInputButton.addEventListener("click", () => inputsDiv.appendChild(createTaskInput()));

    form.appendChild(inputsDiv);
    form.appendChild(addNewTaskInputButton);

    const buttonsDiv = document.createElement("div");
    buttonsDiv.id = "buttons-div";

    const saveButton = document.createElement("button");
    saveButton.type = "submit";
    saveButton.textContent = "SAVE";

    buttonsDiv.appendChild(saveButton);

    form.appendChild(buttonsDiv);

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        saveProjectToLocalStorage(form.elements);
    })

    return form;
}

function projectNameInput() {
    let inputDiv = document.createElement("div");
    inputDiv.classList.add("project-name-input-div");
    let input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Project name...";
    input.maxLength = 70;
    input.minLength = 1;
    input.required = true;
    input.name = "project_name";
    input.classList.add("new-project-input");

    let minDate = new Date().toJSON().slice(0, 10);

    let inputDate = document.createElement("input");
    inputDate.type = "date";
    inputDate.name = "project_date";
    inputDate.min = minDate;
    inputDate.classList.add("project-date");

    inputDiv.appendChild(input);
    inputDiv.appendChild(inputDate);

    return inputDiv;
}

function createTaskInput() {
    let inputDiv = document.createElement("div");
    inputDiv.classList.add("input-div");
    let input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Task...";
    input.maxLength = 120;
    input.minLength = 1;
    input.required = true;
    input.name = "task_name";
    input.classList.add("new-task-input");
    
    let descriptionInput = document.createElement("textarea");
    descriptionInput.classList.add("description-input");
    descriptionInput.classList.add("hidden");
    descriptionInput.name = "task_desc";

    let descriptionButton = document.createElement("button");
    descriptionButton.type = "button";
    descriptionButton.textContent = "D";
    descriptionButton.addEventListener("click", () => {
        if (descriptionInput.classList.contains("hidden")) {
            descriptionInput.classList.remove("hidden");
            descriptionInput.classList.add("shown");
        } else {
            descriptionInput.classList.remove("shown");
            descriptionInput.classList.add("hidden");            
        }
    })

    let minDate = new Date().toJSON().slice(0, 10);

    let inputDate = document.createElement("input");
    inputDate.type = "date";
    inputDate.name = "task_date";
    inputDate.min = minDate;

    let prioritySelect = document.createElement("select");
    prioritySelect.classList.add("priority-select");
    prioritySelect.name = "task_prio";
    let selectOptions = ["low", "normal", "high"];

    for (let i = 0; i < selectOptions.length; i++) {
        let option = document.createElement("option");
        option.value = selectOptions[i];
        option.text = selectOptions[i];
        if (selectOptions[i] == "normal") option.selected = true;
        prioritySelect.appendChild(option);
    }

    let removeTaskButton = document.createElement("button");
    removeTaskButton.type = "button";
    removeTaskButton.classList.add("remove-task-button");
    removeTaskButton.textContent = "X";

    removeTaskButton.addEventListener("click", () => {
        removeTaskButton.parentElement.remove();
    })


    inputDiv.appendChild(input);
    inputDiv.appendChild(descriptionButton);
    inputDiv.appendChild(inputDate);
    inputDiv.appendChild(prioritySelect);
    inputDiv.appendChild(removeTaskButton);
    inputDiv.appendChild(descriptionInput);

    return inputDiv;
}
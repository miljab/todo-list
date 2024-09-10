import { buildProjectsListPage } from './projects_list_page';
import {loadProjects, updateProjectsLocalStorage, daysToDeadline, deleteProject} from './project_controller';
import backIcon from './images/back.png';
import editIcon from './images/edit.png';
import alertIcon from './images/alert.png';
import markDown from './images/chevron-down.png';
import markUp from './images/chevron-up.png';
import { buildEditProjectPage } from './edit_project_page';

export function buildProjectPage(index) {
    const header = document.querySelector("header");
    if (header.classList.contains("header-no-back")) {
        header.classList.remove("header-no-back");
        header.classList.add("header-with-back");
    }

    const projects = loadProjects();
    const project = projects[index];

    const dialog = createModal(index);

    header.textContent = "";
    const h1 = document.createElement("h1");
    h1.textContent = "Project To-Do List";

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

    const projectDiv = document.createElement("div");
    projectDiv.classList.add("project-card");

    const projectSection = document.createElement("div");
    projectSection.classList.add("project-section");

    const projectName = document.createElement("h2");
    projectName.classList.add("project-name");
    projectName.textContent = project.name;

    projectSection.appendChild(projectName);

    const editButton = document.createElement("button");
    editButton.classList.add("edit-project-button");
    const editImg = document.createElement("img");
    editImg.classList.add("edit-img");
    editImg.src = editIcon;

    editButton.addEventListener("click", () => buildEditProjectPage(index));

    editButton.appendChild(editImg);
    projectSection.appendChild(editButton);

    const removeButton = document.createElement("button");
    removeButton.textContent = "X";
    removeButton.classList.add("remove-project-button");
    removeButton.addEventListener("click", () => {
        document.querySelector("body").appendChild(dialog);
        dialog.showModal();
    });

    const removeButtonContainer = document.createElement("div");
    removeButtonContainer.classList.add("remove-button-container");

    removeButtonContainer.appendChild(removeButton);
    projectSection.appendChild(removeButtonContainer);

    const projectDeadline = document.createElement("span");
    projectDeadline.classList.add("project-deadline");
    projectDeadline.textContent = project.deadline;

    if (project.deadline != "" && daysToDeadline(project.deadline) < 1) {
        projectDeadline.style.color = "red";
        const alertImg = document.createElement("img");
        alertImg.src = alertIcon;
        alertImg.classList.add("alert-img");
        projectDeadline.appendChild(alertImg);
    }

    projectSection.appendChild(projectDeadline);

    projectDiv.appendChild(projectSection);

    const tasksSection = document.createElement("div");
    tasksSection.classList.add("tasks-section");

    for (let i = 0; i < project.tasks.length; i++) {
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("task-div");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("task-checkbox");

        taskDiv.appendChild(checkbox);

        const taskName = document.createElement("span");
        taskName.classList.add("task-name-span");
        if (project.tasks[i].done) {
            taskName.classList.add("task-done");
            checkbox.checked = true;
        }
        taskName.textContent = project.tasks[i].name;        

        taskDiv.appendChild(taskName);

        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
                taskName.classList.add("task-done");
            } else {
                taskName.classList.remove("task-done");
            }

            project.tasks[i].changeStatus();
            project.checkStatus();
            projects[index] = project;
            updateProjectsLocalStorage(projects);
            buildProjectPage(index);
        });

        const taskDeadline = document.createElement("span");
        taskDeadline.classList.add("task-deadline-span");

        if (project.tasks[i].deadline != "")
        {
            taskDeadline.textContent = project.tasks[i].deadline;
            if (!project.tasks[i].done) {
                if (daysToDeadline(project.tasks[i].deadline) < 1) {
                    taskDeadline.style.color = "red";
                } else if (daysToDeadline(project.tasks[i].deadline) < 3) {
                    taskDeadline.style.color = "orange";
                }
            } else taskDeadline.style.color = "gray";
        }

        

        const removeTaskButtonContainer = document.createElement("div");
        removeTaskButtonContainer.classList.add("remove-task-button-container");

        const removeTaskButton = document.createElement("button");
        removeTaskButton.classList.add("remove-task-button");
        removeTaskButton.textContent = "X";

        removeTaskButton.addEventListener("click", () => {
            project.tasks.splice(i, 1);
            project.checkStatus();
            projects[index] = project;
            updateProjectsLocalStorage(projects);
            buildProjectPage(index);
        });

        const descDiv = document.createElement("div");
        descDiv.classList.add("desc-div");
        descDiv.classList.add("hidden");

        if (project.tasks[i].desc != "") {
            descDiv.textContent = project.tasks[i].desc;

            const descMark = document.createElement("img");
            descMark.classList.add("desc-mark");
            descMark.src = markDown;
            taskName.appendChild(descMark);

            taskName.addEventListener("click", () => {
                if (descDiv.classList.contains("hidden")) {
                    descDiv.classList.remove("hidden");
                    descDiv.classList.add("shown");
                    descMark.src = markUp;
                } else {
                    descDiv.classList.remove("shown");
                    descDiv.classList.add("hidden");
                    descMark.src = markDown;
                }
            });
        }

        taskDiv.appendChild(taskDeadline);

        removeTaskButtonContainer.appendChild(removeTaskButton);
        taskDiv.appendChild(removeTaskButtonContainer);

        taskDiv.appendChild(descDiv);

        tasksSection.appendChild(taskDiv);
    }

    projectDiv.appendChild(tasksSection);

    content.appendChild(projectDiv);    
}

function createModal(index) {
    const dialog = document.createElement("dialog");
    dialog.classList.add("remove-project-modal");

    const dialogText = document.createElement("h3");
    dialogText.classList.add("dialog-text");
    dialogText.textContent = "Are you sure you want to delete this project?";

    const buttonsDiv = document.createElement("div");
    buttonsDiv.classList.add("dialog-buttons-div");

    const confirmButton = document.createElement("button");
    confirmButton.classList.add("dialog-confirm-button");
    confirmButton.textContent = "Confirm";

    confirmButton.addEventListener("click", () => {
        deleteProject(index);
        dialog.close();
        buildProjectsListPage();
    });

    const cancelButton = document.createElement("button");
    cancelButton.classList.add("dialog-cancel-button");
    cancelButton.textContent = "Cancel";

    cancelButton.addEventListener("click", () => dialog.close());

    buttonsDiv.appendChild(confirmButton);
    buttonsDiv.appendChild(cancelButton);

    dialog.appendChild(dialogText);
    dialog.appendChild(buttonsDiv);

    return dialog;
}
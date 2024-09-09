import { buildProjectsListPage } from './projects_list_page';
import {loadProjects, updateProjectsLocalStorage, daysToDeadline, sortTasks} from './project_controller';
import backIcon from './images/back.png';

export function buildProjectPage(index) {
    const header = document.querySelector("header");
    if (header.classList.contains("header-no-back")) {
        header.classList.remove("header-no-back");
        header.classList.add("header-with-back");
    }

    let projects = loadProjects();
    let project = projects[index];

    project.tasks.sort(sortTasks);

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

    const removeButton = document.createElement("button");
    removeButton.textContent = "X";
    removeButton.classList.add("remove-project-button");
    // removeButton.addEventListener("click", () => {}); to do later

    projectSection.appendChild(removeButton);

    if (project.deadline != "") {
        const projectDeadline = document.createElement("span");
        projectDeadline.classList.add("project-deadline");
        projectDeadline.textContent = project.deadline;

        projectSection.appendChild(projectDeadline);
    }

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
            projects[index] = project;
            updateProjectsLocalStorage(projects);
            buildProjectPage(index);
        });

        // const prioritySelect = document.createElement("select");
        // prioritySelect.classList.add("priority-select");
        // prioritySelect.name = "task_prio";
        // const selectOptions = ["low", "normal", "high"];

        // for (let j = 0; j < selectOptions.length; j++) {
        //     let option = document.createElement("option");
        //     option.value = selectOptions[j];
        //     option.text = selectOptions[j];
        //     if (project.tasks[i].priority == selectOptions[j]) option.selected = true;
        //     prioritySelect.appendChild(option);
        // }

        // prioritySelect.addEventListener("change", () => {
        //     project.tasks[i].priority = prioritySelect.value;
        //     projects[index] = project;
        //     updateProjectsLocalStorage(projects);
        //     buildProjectPage(index);
        // });

        // taskDiv.appendChild(prioritySelect);

        if (project.tasks[i].deadline != "")
        {
            const taskDeadline = document.createElement("span");
            taskDeadline.textContent = project.tasks[i].deadline;
            if (!project.tasks[i].done) {
                if (daysToDeadline(project.tasks[i].deadline) < 1) {
                    taskDeadline.style.color = "red";
                } else if (daysToDeadline(project.tasks[i].deadline) < 3) {
                    taskDeadline.style.color = "orange";
                }
            } else taskDeadline.style.color = "gray";

            
            taskDiv.appendChild(taskDeadline);
        }

        const removeTaskButton = document.createElement("button");
        removeTaskButton.classList.add("remove-task-button");
        removeTaskButton.textContent = "X";

        removeTaskButton.addEventListener("click", () => {
            project.tasks.splice(i, 1);
            projects[index] = project;
            updateProjectsLocalStorage(projects);
            buildProjectPage(index);
        });

        taskDiv.appendChild(removeTaskButton);
        

        tasksSection.appendChild(taskDiv);
    }

    projectDiv.appendChild(tasksSection);

    content.appendChild(projectDiv);    
}
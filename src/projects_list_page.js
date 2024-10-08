import { buildNewProjectPage } from "./add_project_page";
import { loadProjects, daysToDeadline } from "./project_controller";
import { buildProjectPage } from "./project_page";
import alertIcon from './images/alert.png';

export function buildProjectsListPage() {
    const projects = loadProjects();

    const header = document.querySelector("header");
    header.textContent = "";
    header.classList.add("header-no-back");
    if (header.classList.contains("header-with-back")) {
        header.classList.remove("header-with-back");
    }
    const h1 = document.createElement("h1");
    h1.textContent = "Projects To Do";
    header.appendChild(h1);

    const content = document.querySelector("#content");
    content.textContent = "";
    const addProjectButton = document.createElement("button");
    addProjectButton.id = "add-project-button";
    addProjectButton.textContent = "+";

    addProjectButton.addEventListener("click", buildNewProjectPage);
    content.appendChild(addProjectButton);

    for (let i = 0; i < projects.length; i++) {
        let projectOuterDiv = document.createElement("div");
        projectOuterDiv.classList.add("project-outer-div");

        projectOuterDiv.addEventListener("click", () => buildProjectPage(i));

        let projectDiv = document.createElement("div");
        projectDiv.classList.add("project-div");

        projectOuterDiv.appendChild(projectDiv);

        let projectTitle = document.createElement("h2");
        projectTitle.textContent = projects[i].name;
        if (projects[i].done) projectTitle.classList.add("task-done");
        projectDiv.appendChild(projectTitle);

        let projectDate = document.createElement("span");
        projectDate.textContent = projects[i].deadline;
        projectDate.classList.add("project-date-span");

        if (projects[i].deadline != "" && daysToDeadline(projects[i].deadline) < 1 && !projects[i].done) {
            projectDate.style.color = "red";
            const alertImg = document.createElement("img");
            alertImg.src = alertIcon;
            alertImg.classList.add("alert-img");
            projectDate.appendChild(alertImg);
        }

        projectDiv.appendChild(projectDate);

        let projectTasks = document.createElement("ul");
        projectTasks.classList.add("tasks-list");

        for (let j = 0; j < projects[i].tasks.length; j++) {
            let task = document.createElement("li");
            task.textContent = projects[i].tasks[j].name;
            if (projects[i].tasks[j].done) task.classList.add("task-done");
            projectTasks.appendChild(task);
        }

        projectDiv.appendChild(projectTasks);
        content.appendChild(projectOuterDiv);
    }
}
import { buildProjectsListPage } from "./projects_list_page";

function Project(name, deadline, tasks, done) {
    function checkStatus() {
        for (let i = 0; i < this.tasks.length; i++) {
            if (!this.tasks[i].done) {
                return this.done = false;
            }
        }

        return this.done = true;
    }

    return {name, deadline, tasks, done, checkStatus};
}

function Task(name, desc, priority, deadline, done) {
    function changeStatus() {
        this.done = !this.done;
    }

    return {name, desc, priority, deadline, done, changeStatus};
}

export function saveProjectToLocalStorage(elements, index = 0) {
    const projects = !localStorage.getItem("projects") ? [] : JSON.parse(localStorage.getItem("projects"));
    const tasks = [];

    if (elements["task_name"].length != undefined) {
        for (let i = 0; i < elements["task_name"].length; i++) {
            let newTask = Task(elements["task_name"][i].value, elements["task_desc"][i].value, elements["task_prio"][i].value, elements["task_date"][i].value, elements["status"][i].checked);
            tasks.push(newTask);
        }
    } else {
        let newTask = Task(elements["task_name"].value, elements["task_desc"].value, elements["task_prio"].value, elements["task_date"].value, elements["status"].checked);
            tasks.push(newTask);
    }
   

    const newProject = Project(elements["project_name"].value, elements["project_date"].value, tasks, false);

    projects.splice(index, 0, newProject);
    updateProjectsLocalStorage(projects);
}

export function loadProjects() {
    const projects = !localStorage.getItem("projects") ? [] : JSON.parse(localStorage.getItem("projects"));

    for (let i = 0; i < projects.length; i++) {
        let tasks = projects[i].tasks;
        for (let j = 0; j < projects[i].tasks.length; j++) {
            tasks[j] = Task(tasks[j].name, tasks[j].desc, tasks[j].priority, tasks[j].deadline, tasks[j].done);
        }
        tasks.sort(sortTasks);
        projects[i] = Project(projects[i].name, projects[i].deadline, tasks, projects[i].done);
        projects[i].checkStatus();
    }

    projects.sort(sortProjects);
    return projects;
}

export function updateProjectsLocalStorage(projects) {
    localStorage.setItem("projects", JSON.stringify(projects));
}

export function daysToDeadline(date) {
    const today = new Date();
    const deadline = new Date(date);

    const diffTime = Math.abs(deadline - today);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
}

export function sortTasks(a, b) {
    const value = {
        "low": 0,
        "normal": 1,
        "high": 2,
        false: 0,
        true: -3,
    };

    return (value[b.priority] + value[b.done]) - (value[a.priority] + value[a.done]);
}

function sortProjects(a, b) {
    const value = {
        false: 1,
        true: 0,
    };

    return value[b.done] - value[a.done];
}

export function deleteProject(index) {
    const projects = loadProjects();
    projects.splice(index, 1);
    updateProjectsLocalStorage(projects);
}
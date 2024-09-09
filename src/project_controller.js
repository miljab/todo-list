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

export function saveProjectToLocalStorage(elements) {
    let projects = !localStorage.getItem("projects") ? [] : JSON.parse(localStorage.getItem("projects"));
    let tasks = [];

    if (elements["task_name"].length != undefined) {
        for (let i = 0; i < elements["task_name"].length; i++) {
            let newTask = Task(elements["task_name"][i].value, elements["task_desc"][i].value, elements["task_prio"][i].value, elements["task_date"][i].value, false);
            tasks.push(newTask);
        }
    } else {
        let newTask = Task(elements["task_name"].value, elements["task_desc"].value, elements["task_prio"].value, elements["task_date"].value, false);
            tasks.push(newTask);
    }
   

    let newProject = Project(elements["project_name"].value, elements["project_date"].value, tasks, false);

    projects.push(newProject);
    localStorage.setItem("projects", JSON.stringify(projects));

    buildProjectsListPage();
}

export function loadProjects() {
    let projects = !localStorage.getItem("projects") ? [] : JSON.parse(localStorage.getItem("projects"));

    for (let i = 0; i < projects.length; i++) {
        let tasks = projects[i].tasks;
        for (let j = 0; j < projects[i].tasks.length; j++) {
            tasks[j] = Task(tasks[j].name, tasks[j].desc, tasks[j].priority, tasks[j].deadline, tasks[j].done);
        }
        tasks.sort(sortTasks);
        projects[i] = Project(projects[i].name, projects[i].deadline, tasks, projects[i].done);
    }

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

function sortTasks(a, b) {
    const value = {
        "low": 0,
        "normal": 1,
        "high": 2,
        false: 0,
        true: -3,
    };

    return (value[b.priority] + value[b.done]) - (value[a.priority] + value[a.done]);
}

export function deleteProject(index) {
    let projects = loadProjects();
    projects.splice(index, 1);
    updateProjectsLocalStorage(projects);
    buildProjectsListPage();
}
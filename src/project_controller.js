import { buildProjectsListPage } from "./projects_list_page";

function Project(name, deadline, tasks, done) {
    const addTask = (task) => {
        tasks.push(task);
    };

    const removeTask = (index) => {
        tasks.splice(index, 1);
    };

    const changeStatus = () => {
        done = !done;
    };

    return {name, deadline, tasks, done, addTask, removeTask, changeStatus};
}

function Task(name, desc, priority, deadline, done) {
    const changeStatus = () => {
        done = !done;
    };

    return {name, desc, priority, deadline, done, changeStatus};
}

export function saveProjectToLocalStorage(elements) {
    let projects = !localStorage.getItem("projects") ? [] : JSON.parse(localStorage.getItem("projects"));
    let tasks = [];

    for (let i = 0; i < elements["task_name"].length; i++) {
        let newTask = Task(elements["task_name"][i].value, elements["task_desc"][i].value, elements["task_prio"][i].value, elements["task_date"][i].value, false);
        tasks.push(newTask);
    }

    let newProject = Project(elements["project_name"].value, elements["project_date"].value, tasks, false);

    projects.push(newProject);
    localStorage.setItem("projects", JSON.stringify(projects));

    buildProjectsListPage();
}
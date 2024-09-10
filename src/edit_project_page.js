import { formManager, projectNameInput, createTaskInput } from "./add_project_page";
import { buildProjectPage } from "./project_page";
import backIcon from './images/back.png';

export function buildEditProjectPage(index) {
    const header = document.querySelector("header");
    if (header.classList.contains("header-no-back")) {
        header.classList.remove("header-no-back");
        header.classList.add("header-with-back");
    }
    header.textContent = "";
    const h1 = document.createElement("h1");
    h1.textContent = "Edit Project";

    const backButton = document.createElement("button");
    backButton.classList.add("back-button");

    backButton.addEventListener("click", () => {
        buildProjectPage(index);
    });

    const backImg = document.createElement("img");
    backImg.src = backIcon;
    backImg.classList.add("back-img");
    backButton.appendChild(backImg);

    header.appendChild(backButton);

    header.appendChild(h1);

    const content = document.querySelector("#content");
    content.textContent = "";

    content.appendChild(formManager(index));
}
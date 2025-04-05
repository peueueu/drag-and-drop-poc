import { INSERT_ELEMENT_POSITION, PROJECT_STATUS } from "@/src/enums";
import { Component } from "@/classes/Component/Component.class";
import { Project } from "@/classes/Project/Project.class";
import { ProjectState } from "@/src/classes/entities/State/ProjectState.class";
import { ProjectItem } from "./ProjectItem.class";

class ProjectList extends Component<HTMLDivElement, HTMLElement> {
  assignedProjects: Project[] = [];

  constructor(
    private status: "active" | "finished",
    projectState: ProjectState
  ) {
    super(
      "project-list",
      "app",
      INSERT_ELEMENT_POSITION.BEFORE_END,
      `${status}-projects`
    );
    projectState.addListener((projects) => {
      const relevantProjects = projects.filter((project) => {
        if (this.status === PROJECT_STATUS.ACTIVE) {
          return project;
        }

        return project.status === PROJECT_STATUS.FINISHED;
      });
      this.assignedProjects = relevantProjects;
      this.attach();
      this.renderContent();
      this.configure();
    });
  }

  configure() {
    const listElement = document.getElementById(
      `${this.status}-project-list`
    )! as HTMLUListElement;
    listElement.innerHTML = "";
    for (const project of this.assignedProjects) {
      new ProjectItem(this.element.querySelector("ul")!.id, project);
    }
  }

  renderContent() {
    const listId = `${this.status}-project-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.status.toUpperCase() + " PROJECTS";
  }
}

export { ProjectList };

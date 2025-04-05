import { INSERT_ELEMENT_POSITION, PROJECT_STATUS } from "@/src/enums";
import { Component } from "@/classes/Component/Component.class";
import { Project } from "@/classes/Project/Project.class";
import { ProjectState } from "@/src/classes/entities/State/ProjectState.class";
import { ProjectItem } from "./ProjectItem.class";
import { DragTarget } from "@/src/interfaces/drag-n-drop.interface";
import { Autobind } from "@/src/decorators/autobind.decorator";

class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  assignedProjects: Project[] = [];
  projectState: ProjectState = ProjectState.getInstance();

  constructor(private status: "active" | "finished") {
    super(
      "project-list",
      "app",
      INSERT_ELEMENT_POSITION.BEFORE_END,
      `${status}-projects`
    );

    this.configure();
    this.renderContent();
  }

  @Autobind
  dragOverHandler(event: DragEvent) {
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      event.preventDefault();
      const listElement = this.element.querySelector("ul")!;
      listElement.classList.add("droppable");
    }
  }
  @Autobind
  dropHandler(event: DragEvent) {
    const selectedProjectId = event.dataTransfer!.getData("text/plain");
    this.projectState.moveProject(
      selectedProjectId,
      this.status === "active" ? PROJECT_STATUS.ACTIVE : PROJECT_STATUS.FINISHED
    );
  }
  @Autobind
  dragLeaveHandler(_: DragEvent) {
    const listElement = this.element.querySelector("ul")!;
    listElement.classList.remove("droppable");
  }

  configure() {
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("drop", this.dropHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);

    this.projectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter((prj) => {
        if (this.status === "active") {
          return prj.status === PROJECT_STATUS.ACTIVE;
        }
        return prj.status === PROJECT_STATUS.FINISHED;
      });
      this.assignedProjects = relevantProjects;
      this.attach();
      this.renderProjects();
    });
  }

  private renderProjects() {
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

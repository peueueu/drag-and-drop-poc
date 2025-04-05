import { Component } from "@/classes/Component/Component.class";
import { INSERT_ELEMENT_POSITION } from "@/src/enums";
import { Project } from "@/classes/Project/Project.class";
import { Draggable } from "@/src/interfaces/drag-n-drop.interface";
import { Autobind } from "@/src/decorators/autobind.decorator";

class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  private project: Project;

  constructor(public hostId: string, project: Project) {
    super("single-project", hostId, INSERT_ELEMENT_POSITION.BEFORE_END);
    this.project = project;

    this.attach();
    this.configure();
    this.renderContent();
  }

  @Autobind
  dragStartHandler(event: DragEvent) {
    console.log(event);
  }

  @Autobind
  dragEndHandler(_: DragEvent) {
    console.log("drag ended");
  }

  configure() {
    this.element.addEventListener("dragstart", this.dragStartHandler);
    this.element.addEventListener("dragend", this.dragEndHandler);
  }

  renderContent() {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent = this.persons + " assigned";
    this.element.querySelector("p")!.textContent = this.project.description;
  }

  get persons() {
    const parseIntNumOfPersons = parseInt(this.project.people);
    if (parseIntNumOfPersons === 1) {
      return "1 person ";
    } else {
      return `${parseIntNumOfPersons} persons`;
    }
  }
}

export { ProjectItem };

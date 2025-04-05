import { INSERT_ELEMENT_POSITION } from "@/src/enums";

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(
    public templateElementId: string,
    public hostElementId: string,
    public insertElementPosition: INSERT_ELEMENT_POSITION,
    public newElementId?: string
  ) {
    this.templateElement = document.getElementById(
      templateElementId
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId)! as T;
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as U;
    if (this.newElementId) {
      this.element.id = this.newElementId;
    }
  }

  attach() {
    this.hostElement.insertAdjacentElement(
      this.insertElementPosition,
      this.element
    );
  }

  abstract configure(): void;
  abstract renderContent(): void;
}

export { Component };

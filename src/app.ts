type FormInputElement = {
  [key in
    | "titleInputElement"
    | "descriptionInputElement"
    | "peopleInputElement"]: HTMLInputElement;
};

interface FormInputElementFnProps {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;
}
interface FormInputValuesFnProps {
  enteredTitle: string;
  enteredDescription: string;
  enterednumOfPeople: string;
}

interface ProjectProps {
  title: string;
  description: string;
  people: string;
}

function isString(value: any, minLength?: number): value is string;
function isString(value: any, minLength: number = 0): value is string {
  return typeof value === "string" && value.trim().length > minLength;
}

type SafeNumericString = "string";

function isSafeNumericString(value: any): value is SafeNumericString {
  return typeof value === "string" && !isNaN(Number(value));
}

function parseSafeNumericString(value: SafeNumericString) {
  return parseInt(value);
}

function isArray<T>(value: any): value is Array<T> {
  return Array.isArray(value);
}
interface Validatable {
  value: string;
  required?: boolean;
  minLength?: number;
  maxLenght?: number;
  min?: number;
  max?: number;
}

function validate(validatableInput: Validatable) {
  let isValid = true;
  let isValidString = isString(validatableInput.value);
  if (validatableInput.required) {
    isValid = isValid && isValidString;
  }

  if (validatableInput.minLength != null) {
    isValidString = isString(
      validatableInput.value,
      validatableInput.minLength
    );
    isValid = isValid && isValidString;
  }

  if (validatableInput.maxLenght != null && isString(validatableInput.value)) {
    isValid =
      isValid && validatableInput.value.length < validatableInput.maxLenght;
  }

  if (
    validatableInput.min != null &&
    isSafeNumericString(validatableInput.value)
  ) {
    const parsedValidatableInputValue = parseSafeNumericString(
      validatableInput.value
    );
    isValid = isValid && parsedValidatableInputValue > validatableInput.min;
  }
  if (
    validatableInput.max != null &&
    isSafeNumericString(validatableInput.value)
  ) {
    const parsedValidatableInputValue = parseSafeNumericString(
      validatableInput.value
    );
    isValid = isValid && parsedValidatableInputValue < validatableInput.max;
  }

  return isValid;
}

function Autobind(
  _: (...args: any[]) => any,
  ctx: ClassMethodDecoratorContext
) {
  ctx.addInitializer(function (this: any) {
    this[ctx.name] = this[ctx.name].bind(this);
  });
}

enum PROJECT_STATUS {
  ACTIVE = "active",
  FINISHED = "finished",
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: string,
    public status: PROJECT_STATUS
  ) {}
}

type Listener = (items: Project[]) => void;

class ProjectState {
  private projects: Project[] = [];
  private static instance: ProjectState;
  private listeners: Listener[] = [];

  private constructor() {}

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addProject({ title, description, people }: ProjectProps) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      people,
      PROJECT_STATUS.ACTIVE
    );
    this.projects.push(newProject);
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }

  addListener(listenerFn: (projects: Project[]) => void) {
    this.listeners.push(listenerFn);
  }

  getProjects() {
    return this.projects;
  }
}

const projectState = ProjectState.getInstance();

class ProjectTemplate {
  private importedNode: DocumentFragment;
  private templateElement: HTMLTemplateElement;

  constructor(
    public templateElementId: string,
    public elementTag: keyof HTMLElementTagNameMap
  ) {
    this.templateElement = document.getElementById(
      templateElementId
    )! as HTMLTemplateElement;
    this.importedNode = document.importNode(this.templateElement.content, true);
  }

  getImportedNode() {
    const htmlTag = this.elementTag;
    return this.importedNode
      .firstChild as HTMLElementTagNameMap[typeof htmlTag];
  }
  getTemplate() {
    return this.templateElement;
  }
}

class ProjectList {
  element: HTMLElement;
  hostElement: HTMLDivElement;
  assignedProjects: Project[] = [];

  constructor(private status: "active" | "finished") {
    const projectListSectionTemplate = new ProjectTemplate(
      "project-list",
      "section"
    );

    this.hostElement = document.getElementById("app")! as HTMLDivElement;

    const importedNode = document.importNode(
      projectListSectionTemplate.getTemplate().content,
      true
    );

    this.element = importedNode.firstElementChild as HTMLElement;
    this.element.id = `${this.status}-projects`;
    projectState.addListener((projects) => {
      const relevantProjects = projects.filter((project) => {
        if (this.status === PROJECT_STATUS.ACTIVE) {
          return project;
        }

        return project.status === PROJECT_STATUS.FINISHED;
      });
      console.log(
        "🚀 ~ ProjectList ~ relevantProjects ~ relevantProjects:",
        relevantProjects
      );
      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });
    this.attach();
    this.renderContent();
  }

  private renderProjects() {
    const listElement = document.getElementById(
      `${this.status}-projects-list`
    )! as HTMLUListElement;
    listElement.innerHTML = "";
    for (const project of this.assignedProjects) {
      let listItem = document.createElement("li");
      const projectHeadingTitle = document.createElement("h3");
      projectHeadingTitle.textContent = project.title;
      const descriptionParagraph = document.createElement("p");
      descriptionParagraph.textContent = `Description: ${project.description}`;
      const peopleParagraph = document.createElement("p");
      peopleParagraph.textContent = `People: ${project.people}`;
      listItem.appendChild(projectHeadingTitle);
      listItem.appendChild(descriptionParagraph);
      listItem.appendChild(peopleParagraph);
      listElement.appendChild(listItem);
    }
  }

  private renderContent() {
    const listId = `${this.status}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.status.toUpperCase() + " PROJECTS";
  }

  private attach() {
    this.hostElement.insertAdjacentElement("beforeend", this.element);
  }
}

class ProjectInput {
  private titleInputElement: FormInputElement["titleInputElement"];
  private descriptionInputElement: FormInputElement["descriptionInputElement"];
  private peopleInputElement: FormInputElement["peopleInputElement"];

  constructor(private project: ProjectForm) {
    const formElement = this.project.getFormElement;

    this.titleInputElement = formElement.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = formElement.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputElement = formElement.querySelector(
      "#people"
    ) as HTMLInputElement;
  }

  getFieldValue(
    field:
      | "titleInputElement"
      | "descriptionInputElement"
      | "peopleInputElement"
  ) {
    return this[field];
  }
  setFieldValue(
    field:
      | "titleInputElement"
      | "descriptionInputElement"
      | "peopleInputElement",
    value: HTMLInputElement
  ) {
    return (this[field] = value);
  }

  set setTitleFieldValue(value: string) {
    this.titleInputElement.value = value;
  }
  set setDescriptionFieldValue(value: string) {
    this.descriptionInputElement.value = value;
  }
  set setPeopleFieldValue(value: string) {
    this.peopleInputElement.value = value;
  }
}

class ProjectForm {
  private hostElement: HTMLDivElement;
  private element: HTMLFormElement;

  constructor() {
    const formTemplate = new ProjectTemplate("project-input", "form");
    this.hostElement = document.getElementById("app")! as HTMLDivElement;

    const importedNode = document.importNode(
      formTemplate.getTemplate().content,
      true
    );

    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = "user-input";

    const projectInput = new ProjectInput(this);
    const titleInputElement = projectInput.getFieldValue("titleInputElement");
    const descriptionInputElement = projectInput.getFieldValue(
      "descriptionInputElement"
    );
    const peopleInputElement = projectInput.getFieldValue("peopleInputElement");

    this.configure({
      titleInputElement,
      descriptionInputElement,
      peopleInputElement,
    });
    this.attachToHostElement(this.element);
  }

  private gatherUserInput({
    enteredTitle,
    enteredDescription,
    enterednumOfPeople,
  }: FormInputValuesFnProps): [string, string, string] | void {
    const titleValidatable: Validatable = {
      value: enteredTitle,
      minLength: 5,
      required: true,
    };
    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      minLength: 5,
      required: true,
    };
    const peopleValidatable: Validatable = {
      value: enterednumOfPeople,
      min: 1,
      max: 9,
      required: true,
    };

    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
    ) {
      alert("Invalid input please try again");
      return;
    }

    return [
      titleValidatable.value,
      descriptionValidatable.value,
      peopleValidatable.value,
    ];
  }

  private clearInputs({
    titleInputElement,
    descriptionInputElement,
    peopleInputElement,
  }: FormInputElementFnProps) {
    titleInputElement.value = "";
    descriptionInputElement.value = "";
    peopleInputElement.value = "";
  }

  @Autobind
  private submitHandler(
    event: Event,
    {
      titleInputElement,
      descriptionInputElement,
      peopleInputElement,
    }: FormInputElementFnProps
  ) {
    event.preventDefault();
    const userInput = this.gatherUserInput({
      enteredTitle: titleInputElement.value,
      enteredDescription: descriptionInputElement.value,
      enterednumOfPeople: peopleInputElement.value,
    });
    if (isArray(userInput)) {
      const [title, description, people] = userInput;
      projectState.addProject({ title, description, people });
      this.clearInputs({
        titleInputElement,
        descriptionInputElement,
        peopleInputElement,
      });
    }
  }

  private configure({
    titleInputElement,
    descriptionInputElement,
    peopleInputElement,
  }: FormInputElementFnProps) {
    this.element.addEventListener("submit", (event: Event) =>
      this.submitHandler(event, {
        titleInputElement,
        descriptionInputElement,
        peopleInputElement,
      })
    );
  }

  private attachToHostElement<T extends HTMLElement>(element: T) {
    this.hostElement.insertAdjacentElement("afterbegin", element);
  }

  get getFormElement() {
    return this.element;
  }
}

const _ = new ProjectForm();
const _2 = new ProjectList(PROJECT_STATUS.ACTIVE);
const _3 = new ProjectList(PROJECT_STATUS.FINISHED);

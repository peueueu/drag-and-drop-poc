type FormInputElement = {
  [key in
    | "titleInputElement"
    | "descriptionInputElement"
    | "peopleInputElement"]: HTMLInputElement;
};

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

type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    super();
  }

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

  getProjects() {
    return this.projects;
  }
}

const projectState = ProjectState.getInstance();

enum INSERT_ELEMENT_POSITION {
  BEFORE_END = "beforeend",
  AFTER_BEGIN = "afterbegin",
}

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

class ProjectList extends Component<HTMLDivElement, HTMLElement> {
  assignedProjects: Project[] = [];

  constructor(private status: "active" | "finished") {
    super(
      "project-list",
      "app",
      INSERT_ELEMENT_POSITION.BEFORE_END,
      `${status}-project-list`
    );
    projectState.addListener((projects) => {
      const relevantProjects = projects.filter((project) => {
        if (this.status === PROJECT_STATUS.ACTIVE) {
          return project;
        }

        return project.status === PROJECT_STATUS.FINISHED;
      });
      this.assignedProjects = relevantProjects;
      this.configure();
    });

    this.attach();
    this.renderContent();
  }

  configure() {
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

  renderContent() {
    const listId = `${this.status}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.status.toUpperCase() + " PROJECTS";
  }
}

class ProjectForm extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: FormInputElement["titleInputElement"];
  descriptionInputElement: FormInputElement["descriptionInputElement"];
  peopleInputElement: FormInputElement["peopleInputElement"];

  constructor() {
    super(
      "project-input",
      "app",
      INSERT_ELEMENT_POSITION.AFTER_BEGIN,
      "user-input"
    );

    this.titleInputElement = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;

    this.attach();
    this.configure();
  }

  configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  renderContent() {}

  private gatherUserInput(): [string, string, string] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enterednumOfPeople = this.peopleInputElement.value;
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

  private clearInputs() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }

  @Autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    if (isArray(userInput)) {
      const [title, description, people] = userInput;
      projectState.addProject({ title, description, people });
      this.clearInputs();
    }
  }
}

const _ = new ProjectForm();
const _2 = new ProjectList(PROJECT_STATUS.ACTIVE);
const _3 = new ProjectList(PROJECT_STATUS.FINISHED);

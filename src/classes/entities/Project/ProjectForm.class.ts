import { Component } from "@/classes/Component/Component.class";
import { FormInputElement } from "@/types/index.types";
import { isArray } from "@/src/types/guards.types";
import { Validatable } from "@/interfaces/validatable.interface";
import { Autobind } from "@/decorators/autobind.decorator";
import { INSERT_ELEMENT_POSITION } from "@/src/enums";
import { validateFormFields } from "@/src/helpers/validate-form-fields.helper";
import { ProjectState } from "@/classes/State/ProjectState.class";

class ProjectForm extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: FormInputElement["titleInputElement"];
  descriptionInputElement: FormInputElement["descriptionInputElement"];
  peopleInputElement: FormInputElement["peopleInputElement"];

  constructor(public projectState: ProjectState) {
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
      min: 0,
      max: 9,
      required: true,
    };

    if (
      !validateFormFields(titleValidatable) ||
      !validateFormFields(descriptionValidatable) ||
      !validateFormFields(peopleValidatable)
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
      this.projectState.addProject({ title, description, people });
      this.clearInputs();
    }
  }
}

export { ProjectForm };

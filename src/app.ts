import { PROJECT_STATUS } from "@/src/enums";
import { ProjectForm } from "@/classes/Project/ProjectForm.class";
import { ProjectList } from "@/classes/Project/ProjectList.class";

class App {
  static run() {
    const _projectForm = new ProjectForm();

    const _activeProjectsList = new ProjectList(PROJECT_STATUS.ACTIVE);

    const _finishedProjectsList = new ProjectList(PROJECT_STATUS.FINISHED);

    void _projectForm;
    void _activeProjectsList;
    void _finishedProjectsList;
  }
}

App.run();

import { PROJECT_STATUS } from "@/src/enums";
import { ProjectState } from "@/classes/State/ProjectState.class";
import { ProjectForm } from "@/classes/Project/ProjectForm.class";
import { ProjectList } from "@/classes/Project/ProjectList.class";

const projectState = ProjectState.getInstance();
class App {
  static run() {
    const _projectForm = new ProjectForm(projectState);

    const _activeProjectsList = new ProjectList(
      PROJECT_STATUS.ACTIVE,
      projectState
    );

    const _finishedProjectsList = new ProjectList(
      PROJECT_STATUS.FINISHED,
      projectState
    );

    void _projectForm;
    void _activeProjectsList;
    void _finishedProjectsList;
  }
}

App.run();

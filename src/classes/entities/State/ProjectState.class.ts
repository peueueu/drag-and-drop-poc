import { PROJECT_STATUS } from "@/src/enums";
import { ProjectProps } from "@/interfaces/project-props.interface";
import { Project } from "@/classes/Project/Project.class";
import { State } from "@/classes/State/State.class";

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

  setProjects(projects: Project[]) {
    this.projects = [...projects];
  }
}

export { ProjectState };

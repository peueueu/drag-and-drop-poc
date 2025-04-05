import { PROJECT_STATUS } from "@/src/enums";

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: string,
    public status: PROJECT_STATUS
  ) {}
}

export { Project };

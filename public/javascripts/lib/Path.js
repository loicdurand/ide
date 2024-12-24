export default class {

  #project;
  #controller;
  #action;

  constructor(pathname = '/') {
    const //
      [project = '', controller = '', action = ''] = pathname.split('/').filter(Boolean);
    this
      .setProject(project)
      .setController(controller)
      .setAction(action);
    return this;
  }

  getProject() {
    return this.#project;
  }

  setProject(project) {
    this.#project = project;
    return this;
  }

  getController() {
    return this.#controller;
  }

  setController(controller) {
    this.#controller = controller;
    return this;
  }

  getAction() {
    return this.#action;
  }

  setAction(action) {
    this.#action = action;
  }

};
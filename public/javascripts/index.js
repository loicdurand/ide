import '@seald-io/nedb/browser-version/out/nedb';

import App from 'unviewed';
import Path from './lib/Path';


const // 
  db = {
    projects: new Nedb({ filename: 'projects.db', autoload: true }),
    controllers: new Nedb({ filename: 'controllers.db', autoload: true }),
    actions: new Nedb({ filename: 'actions.db', autoload: true })
  },
  head_title = document.querySelector('title'),
  PROJECT_NAME = head_title.innerText,
  { pathname, search } = location,

  current_project = new Path(pathname).getProject();

// RECH. PROJECT_EXISTS
db.projects.findOne({ name: current_project }, (err, project) => {

  if (project === null)
    db.projects.insert({ name: current_project });

  // RECH. PROJECTS
  db.projects.find({}, (err, projects) => {

    console.log({ projects });

    const // 
      title = new App({
        container: head_title,
        current_project,
        events: {
          onupdate: () => ({
            'title': ({ target, current_project }) => {
              if (current_project)
                target.innerText = `${current_project}@${PROJECT_NAME}`;
            }
          })
        }
      }),

      create_project_li = ({ project, active }) => new App({

        container: document.querySelector('#project-template'),

        project,
        active,

        events: {
          onupdate: () => ({
            '.project-name': ({ target, project, active }) => {
              target.innerHTML = project;
              target.classList[active ? 'add' : 'remove']('active');
            }
          })
        }
      }),

      projects_ul = new App({

        container: '#projects-container',

        projects,
        active_project: current_project,

        events: {
          onupdate: () => ({
            '#projects-list': ({ target, projects, active }) => {
              target.innerHTML = '';
              projects.forEach(project => {
                const project_li = create_project_li({ project: project.name, active: current_project === project.name });
                target.append(project_li.container);
              });
            }
          })
        }

      });

  })
  // FIN RECH. PROJECTS

});
// FIN RECH. PROJECT_EXISTS

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

  if (project === null && current_project)
    db.projects.insert({ name: current_project });

  // RECH. PROJECTS
  db.projects.find({}, (err, projects) => {

    // --> gestion de la balise <title> du document
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
      // <-- fin gestion de la balise <title> du document

      // --> gestion de la balise <nav id="projects-container">
      projects_ul = new App({

        container: '#projects-container',

        projects: projects.map(({ name }) => name),
        active_project: current_project,
        elements: {
          'li': ({ project, active }) => new App({

            container: document.querySelector('#project-template'),

            project,
            active,

            confirmDeleteElement({ project, active, entity, parent }) {
              if (window.confirm(`Le projet "${project}" va être définitivement supprimé.`)) {
                db.projects.remove({ name: project }, (err, nb_removed) => {
                  const active_removed = active;
                  if (nb_removed) {
                    App.remove(entity);
                    db.projects.find({}, (err, projects) => {
                      projects_ul.state.projects = projects.map(({ name }) => name);
                      // si le projet supprimé était celui actif, on "active" le dernier autre
                      // en redirigeant vers '/{projet_actif}
                      if (active_removed)
                        window.location.href = projects[projects.length - 1].name;
                      else
                        App.update(projects_ul);
                    });
                  }
                });
              }
            },

            events: {
              onupdate: () => ({
                '.project-link': ({ target, project }) => target.setAttribute('href', `/${project}`),
                '.project-header': ({ target, project, active }) => {
                  target.innerHTML = project;
                  target.classList[active ? 'add' : 'remove']('active');
                }
              }),
              onclick: actions => ({
                '.close': (state) => {
                  actions.confirmDeleteElement(state);
                }
              })
            }
          })
        },

        events: {
          onupdate: () => ({
            '#projects-list': ({ target, projects, active, elements }) => {
              target.innerHTML = '';
              projects.forEach(project => {
                const project_li = elements.li({ project, active: current_project === project });
                target.append(project_li.container);
              });
            }
          })
        }

      });
    // <-- fin gestion de la balise <nav id="projects-container">


  })
  // FIN RECH. PROJECTS

});
// FIN RECH. PROJECT_EXISTS

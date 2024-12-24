import App from 'unviewed';
import Path from './lib/Path';

const // 
  head_title = document.querySelector('title'),
  PROJECT_NAME = head_title.innerText,
  { pathname, search } = location,

  current_project = new Path(pathname).getProject(),

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

    projects: [current_project],
    active_project: current_project,

    events: {
      onupdate: () => ({
        '#projects-list': ({ target, projects, active }) => {
          target.innerHTML = '';
          projects.forEach(project => {
            const project_li = create_project_li({ project, active: current_project === project });
            target.append(project_li.container);
          });
        }
      })
    }

  });

// window.proxy = new Proxy(state, {
//   set(target, prop, receiver) {
//     if (prop === 'current_project') {
//       target[prop] = receiver;
//       title.state.current_project = receiver;
//       projects_ul.state.active = receiver;
//       projects_ul.state.projects.push(project_li({ project: receiver }))

//       App.update(title, projects_ul);
//     }
//   }
// });
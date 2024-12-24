const //
  PROJECT_NAME = 'id&#1101;';

module.exports = (req, res, next) => {

  // const { path, query } = req;

  res.render('index', {
    PROJECT_NAME
  });
};
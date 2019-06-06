
exports.seed = function(knex, Promise) {
  return knex('users')
    .truncate()
    .then(function () {
      return knex('users').insert([
        {
          username: 'Larry',
          password: 'hey'
        },
        {
          username: 'Curly',
          password: 'nyuk'
        },
        {
          username: 'Moe',
          password: 'wiseguy'
        }
      ]);
    });
};
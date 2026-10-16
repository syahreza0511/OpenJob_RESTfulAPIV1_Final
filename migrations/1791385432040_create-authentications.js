exports.shorthands = undefined;


exports.up = (pgm) => {

  pgm.createTable('authentications', {

    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },

    refresh_token: {
      type: 'TEXT',
      notNull: true
    },

    created_at: {
      type: 'TIMESTAMP',
      default: pgm.func('CURRENT_TIMESTAMP')
    },

    updated_at: {
      type: 'TIMESTAMP',
      default: pgm.func('CURRENT_TIMESTAMP')
    }

  });

};


exports.down = (pgm) => {

  pgm.dropTable('authentications');

};
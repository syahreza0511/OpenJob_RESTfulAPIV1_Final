exports.shorthands = undefined;


exports.up = (pgm) => {
  pgm.createTable('users', {

    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },

    username: {
      type: 'VARCHAR(50)',
      notNull: true,
      unique: true
    },

    email: {
      type: 'VARCHAR(100)',
      notNull: true,
      unique: true
    },

    password: {
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
  pgm.dropTable('users');
};
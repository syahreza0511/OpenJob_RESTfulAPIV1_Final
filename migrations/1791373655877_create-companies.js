exports.shorthands = undefined;


exports.up = (pgm) => {

  pgm.createTable('companies', {

    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },

    name: {
      type: 'VARCHAR(100)',
      notNull: true,
      unique: true
    },

    description: {
      type: 'TEXT'
    },

    location: {
      type: 'VARCHAR(100)'
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

  pgm.dropTable('companies');

};
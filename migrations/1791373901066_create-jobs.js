exports.shorthands = undefined;


exports.up = (pgm) => {

  pgm.createTable('jobs', {

    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },

    company_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'companies(id)',
      onDelete: 'CASCADE'
    },

    category_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'categories(id)',
      onDelete: 'CASCADE'
    },

    title: {
      type: 'VARCHAR(100)',
      notNull: true
    },

    description: {
      type: 'TEXT',
      notNull: true
    },

    location: {
      type: 'VARCHAR(100)',
      notNull: true
    },

    salary: {
      type: 'INTEGER',
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

  pgm.dropTable('jobs');

};
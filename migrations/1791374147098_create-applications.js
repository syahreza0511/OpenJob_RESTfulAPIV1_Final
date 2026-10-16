exports.shorthands = undefined;


exports.up = (pgm) => {

  pgm.createTable('applications', {

    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },

    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE'
    },

    job_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'jobs(id)',
      onDelete: 'CASCADE'
    },

    status: {
      type: 'VARCHAR(50)',
      notNull: true,
      default: 'pending'
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

  pgm.dropTable('applications');

};
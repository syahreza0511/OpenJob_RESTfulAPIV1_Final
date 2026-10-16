exports.shorthands = undefined;

// Additive migration: sengaja tidak menghapus / mengubah kolom lama.
exports.up = (pgm) => {
  pgm.addColumns('jobs', {
    job_type: { type: 'VARCHAR(50)' },
    experience_level: { type: 'VARCHAR(50)' },
    location_type: { type: 'VARCHAR(50)' },
    location_city: { type: 'VARCHAR(100)' },
    salary_min: { type: 'INTEGER' },
    salary_max: { type: 'INTEGER' },
    is_salary_visible: { type: 'BOOLEAN', default: true },
    status: { type: 'VARCHAR(30)', default: 'open' },
  });
};

// PERINGATAN: rollback menghilangkan data di kolom-kolom tambahan.
exports.down = (pgm) => {
  pgm.dropColumns('jobs', [
    'job_type', 'experience_level', 'location_type', 'location_city',
    'salary_min', 'salary_max', 'is_salary_visible', 'status',
  ]);
};

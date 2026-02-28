import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import AppDataSource from '../data-source';
import { RoleOrmEntity } from '../../../modules/user/infrastructure/typeorm/role.orm-entity';
import { UserOrmEntity } from '../../../modules/user/infrastructure/typeorm/user.orm-entity';

async function seed() {
  const dataSource: DataSource = await AppDataSource.initialize();

  const roleRepository = dataSource.getRepository(RoleOrmEntity);
  const userRepository = dataSource.getRepository(UserOrmEntity);

  console.log('🌱 Running seed...');

  // ===== Criar Roles =====
  let adminRole = await roleRepository.findOne({
    where: { name: 'ADMIN' },
  });

  if (!adminRole) {
    adminRole = roleRepository.create({
      id: crypto.randomUUID(),
      name: 'ADMIN',
    });
    await roleRepository.save(adminRole);
    console.log('✔ ADMIN role created');
  }

  let staffRole = await roleRepository.findOne({
    where: { name: 'STAFF' },
  });

  if (!staffRole) {
    staffRole = roleRepository.create({
      id: crypto.randomUUID(),
      name: 'STAFF',
    });
    await roleRepository.save(staffRole);
    console.log('✔ STAFF role created');
  }

  // ===== Criar Admin =====
  const adminExists = await userRepository.findOne({
    where: { email: 'admin@admin.com' },
  });

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    const adminUser = userRepository.create({
      id: crypto.randomUUID(),
      name: 'Admin',
      email: 'admin@admin.com',
      password: hashedPassword,
      isActive: true,
      role: adminRole,
    });

    await userRepository.save(adminUser);
    console.log('✔ Admin user created');
  }

  // ===== Criar Staff =====
  const staffExists = await userRepository.findOne({
    where: { email: 'staff@staff.com' },
  });

  if (!staffExists) {
    const hashedPassword = await bcrypt.hash('Staff@123', 10);

    const staffUser = userRepository.create({
      id: crypto.randomUUID(),
      name: 'Staff User',
      email: 'staff@staff.com',
      password: hashedPassword,
      isActive: true,
      role: staffRole,
    });

    await userRepository.save(staffUser);
    console.log('✔ Staff user created');
  }

  console.log('🌱 Seed completed');
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});

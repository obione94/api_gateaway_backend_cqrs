import { getDB } from '../infrastructure/db/leveldb';
import { UserRepository } from '../domain/repositories/UserRepository';
import { hashPassword } from '../infrastructure/security/password';

async function addTestUsers() {
  // Attend que la DB soit ouverte
  await (await getDB()); // ou stocker const db = await getDB();
  const userRepository = new UserRepository();

  // Les utilisateurs à ajouter (exemple)
  const users = Array.from({ length: 10 }, (_, i) => ({
    username: `user${i + 1}`,
    password: `password${i + 1}`
  }));

  for (const user of users) {
    // Hash le mot de passe avant sauvegarde
    const hashedPassword = await hashPassword(user.password);

    // Vérifie si l'utilisateur existe déjà pour éviter doublon
    const exists = await userRepository.getByUsername(user.username);
    if (!exists) {
      await userRepository.create({ username: user.username, password: hashedPassword });
      console.log(`Utilisateur ajouté : ${user.username}`);
    } else {
      console.log(`Déjà présent : ${user.username}`);
    }
  }
}

addTestUsers()
  .then(() => {
    console.log('Migration terminée.');
    process.exit(0);
  })
  .catch(err => {
    console.error('Erreur migration :', err);
    process.exit(1);
  });

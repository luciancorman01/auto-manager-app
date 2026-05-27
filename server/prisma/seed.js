// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const hashedPassword = await bcrypt.hash("parola123", 10);

  const user = await prisma.user.upsert({
    where: { email: "stefan@autocare.ro" },
    update: {},
    create: {
      nume_complet: "Ștefan cel Mare",
      email: "stefan@autocare.ro",
      parola: hashedPassword,
      poza_profil: null,
    },
  });

  console.log(`✅ User creat: ${user.email}`);

  const vehicle = await prisma.vehicle.upsert({
    where: { vin: "RO1DACIA0LOGAN2022" },
    update: {},
    create: {
      user_id: user.id,
      marca: "Dacia",
      model: "Logan",
      nr_inmatriculare: "B 123 ABC",
      vin: "RO1DACIA0LOGAN2022",
      an_fabricatie: 2022,
    },
  });

  console.log(`✅ Vehicul creat: ${vehicle.marca} ${vehicle.model}`);

  await prisma.document.createMany({
    data: [
      {
        vehicle_id: vehicle.id,
        tip: "RCA",
        data_expirare: new Date("2025-12-31"),
        pret_platit: 850,
        companie: "Allianz",
      },
      {
        vehicle_id: vehicle.id,
        tip: "ITP",
        data_expirare: new Date("2025-08-15"),
        pret_platit: 200,
        companie: "RAR",
      },
      {
        vehicle_id: vehicle.id,
        tip: "Rovinieta",
        data_expirare: new Date("2025-06-01"),
        pret_platit: 28,
        companie: "CNAIR",
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Documente create");

  await prisma.serviceHistory.createMany({
    data: [
      {
        vehicle_id: vehicle.id,
        data: new Date("2024-03-10"),
        descriere: "Schimb ulei și filtre",
        kilometri: 115000,
        cost_total: 450,
      },
      {
        vehicle_id: vehicle.id,
        data: new Date("2024-09-22"),
        descriere: "Schimb plăcuțe frână față",
        kilometri: 120000,
        cost_total: 800,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Istoric service creat");
  console.log("🎉 Seed complet!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

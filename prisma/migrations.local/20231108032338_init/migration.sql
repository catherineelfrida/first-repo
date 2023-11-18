-- CreateTable
CREATE TABLE "customer" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,

    CONSTRAINT "customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" SERIAL NOT NULL,
    "nasabahid" INTEGER NOT NULL,
    "accnumber" INTEGER NOT NULL,
    "jenis" TEXT NOT NULL,
    "saldo" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction" (
    "id" SERIAL NOT NULL,
    "srcacc" INTEGER NOT NULL,
    "destacc" INTEGER,
    "transactiontype" TEXT NOT NULL,
    "jumlah" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customer_email_key" ON "customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "account_accnumber_key" ON "account"("accnumber");

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_nasabahid_fkey" FOREIGN KEY ("nasabahid") REFERENCES "customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_srcacc_fkey" FOREIGN KEY ("srcacc") REFERENCES "account"("accnumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_destacc_fkey" FOREIGN KEY ("destacc") REFERENCES "account"("accnumber") ON DELETE SET NULL ON UPDATE CASCADE;

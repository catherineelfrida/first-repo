-- DropForeignKey
ALTER TABLE "transaction" DROP CONSTRAINT "transaction_destacc_fkey";

-- AlterTable
ALTER TABLE "transaction" ALTER COLUMN "destacc" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_destacc_fkey" FOREIGN KEY ("destacc") REFERENCES "account"("accnumber") ON DELETE SET NULL ON UPDATE CASCADE;

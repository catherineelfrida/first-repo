/*
  Warnings:

  - Added the required column `updatedAt` to the `BankAccount` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `account_number` on the `BankAccount` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `balance` on the `BankAccount` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `identify_number` on the `Profile` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "BankAccount" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "account_number",
ADD COLUMN     "account_number" INTEGER NOT NULL,
DROP COLUMN "balance",
ADD COLUMN     "balance" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "identify_number",
ADD COLUMN     "identify_number" INTEGER NOT NULL;

/*
  Warnings:

  - Added the required column `trans_date` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "trans_date" BIGINT NOT NULL;

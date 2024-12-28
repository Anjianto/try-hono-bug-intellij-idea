/*
  Warnings:

  - A unique constraint covering the columns `[unique_identifier]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `unique_identifier` to the `categories` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "categories_name_key";

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "unique_identifier" VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "categories_unique_identifier_key" ON "categories"("unique_identifier");

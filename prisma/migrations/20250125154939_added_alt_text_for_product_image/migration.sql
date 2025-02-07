/*
  Warnings:

  - Added the required column `alt` to the `ProductImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ProductImage` ADD COLUMN `alt` VARCHAR(255) NOT NULL;

/*
  Warnings:

  - You are about to drop the column `address` on the `Lab` table. All the data in the column will be lost.
  - Added the required column `city` to the `Branch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Branch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Branch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Lab` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Lab` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalCode` to the `Lab` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Lab` table without a default value. This is not possible if the table is not empty.
  - Made the column `updatedAt` on table `Lab` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `updatedAt` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[User] DROP CONSTRAINT [User_labId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Branch] ADD [city] NVARCHAR(1000) NOT NULL,
[country] NVARCHAR(1000) NOT NULL,
[state] NVARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[Lab] ALTER COLUMN [updatedAt] DATETIME2 NOT NULL;
ALTER TABLE [dbo].[Lab] DROP COLUMN [address];
ALTER TABLE [dbo].[Lab] ADD [address1] NVARCHAR(1000),
[address2] NVARCHAR(1000),
[city] NVARCHAR(1000) NOT NULL,
[country] NVARCHAR(1000) NOT NULL,
[postalCode] NVARCHAR(1000) NOT NULL,
[registrationNo] NVARCHAR(1000),
[state] NVARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[User] ALTER COLUMN [updatedAt] DATETIME2 NOT NULL;
ALTER TABLE [dbo].[User] ADD [branchId] INT,
[phone] NVARCHAR(1000) NOT NULL;

-- AddForeignKey
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_labId_fkey] FOREIGN KEY ([labId]) REFERENCES [dbo].[Lab]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_branchId_fkey] FOREIGN KEY ([branchId]) REFERENCES [dbo].[Branch]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

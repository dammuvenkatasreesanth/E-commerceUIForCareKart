-- DropForeignKey
ALTER TABLE `OtpRequest` DROP FOREIGN KEY `OtpRequest_userId_fkey`;

-- DropIndex
DROP INDEX `User_phone_key` ON `User`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `emailVerified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `emailVerifiedAt` DATETIME(3) NULL,
    ADD COLUMN `facebookId` VARCHAR(191) NULL,
    ADD COLUMN `googleId` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `OtpRequest`;

-- CreateTable
CREATE TABLE `EmailVerificationToken` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `tokenHash` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `consumedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `EmailVerificationToken_tokenHash_key`(`tokenHash`),
    INDEX `EmailVerificationToken_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_googleId_key` ON `User`(`googleId`);

-- CreateIndex
CREATE UNIQUE INDEX `User_facebookId_key` ON `User`(`facebookId`);

-- AddForeignKey
ALTER TABLE `EmailVerificationToken` ADD CONSTRAINT `EmailVerificationToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;


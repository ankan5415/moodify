/*
  Warnings:

  - A unique constraint covering the columns `[spotifyId]` on the table `Playlist` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Playlist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spotifyId` to the `Playlist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Playlist" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "spotifyId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Playlist_spotifyId_key" ON "Playlist"("spotifyId");

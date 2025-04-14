-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Option" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ask_for_item" BOOLEAN NOT NULL DEFAULT false,
    "ask_for_location" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Option" ("description", "id", "name") SELECT "description", "id", "name" FROM "Option";
DROP TABLE "Option";
ALTER TABLE "new_Option" RENAME TO "Option";
CREATE UNIQUE INDEX "Option_name_key" ON "Option"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

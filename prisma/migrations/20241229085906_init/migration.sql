-- CreateTable
CREATE TABLE "Pet" (
    "id" SERIAL NOT NULL,
    "petName" TEXT,
    "petAge" INTEGER,

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("id")
);

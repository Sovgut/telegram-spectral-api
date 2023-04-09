-- CreateTable
CREATE TABLE "Webhook" (
    "host" TEXT NOT NULL,
    "secret" TEXT NOT NULL,

    CONSTRAINT "Webhook_pkey" PRIMARY KEY ("host")
);

-- CreateIndex
CREATE UNIQUE INDEX "Webhook_host_key" ON "Webhook"("host");

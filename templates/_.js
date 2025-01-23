// model Cart {
//   id              String        @id @default(cuid())
//   notes           String?       @db.Text
//   productId       String        @db.VarChar(100)
//   copies          Int           @default(1)
//   subTotalPrice   Decimal       @db.Decimal(12, 2)
//   finalTotalCogs  Decimal       @db.Decimal(12, 2)
//   finalTotalPrice Decimal       @db.Decimal(12, 2)
//   promotionCode   String?       @db.VarChar(100) @map("promotion_code")
//   status          CART_STATUS   @default(PENDING)
//   createdAt       DateTime      @default(now()) @map("created_at") @db.Timestamp(0)
//   updatedAt       DateTime      @updatedAt @map("updated_at") @db.Timestamp(0)

//   // Relasi ke User
//   userEmail       String        @db.VarChar(100) @map("user_email")
//   user            User          @relation(fields: [userEmail], references: [email], onDelete: Cascade)

//   // Relasi ke Promotion
//   promotion       Promotion?    @relation(fields: [promotionCode], references: [code])

//   // Relasi ke Product
//   product         Product       @relation(fields: [productId], references: [barcode])

//   // Relasi ke CartItem dan CartFile
//   cartItems       CartItem[]
//   cartFiles       CartFile[]

//   // Relasi ke Transaction
//   transaction     Transaction?

//   @@map("cart")
// }

// model CartItem {
//   id              String  @id @default(cuid())
//   cartId          String  @db.VarChar(100)

//   componentName    String?    @db.VarChar(100)
//   qualityName      String?    @db.VarChar(100)
//   sizeName         String?    @db.VarChar(100)
//   qty             Int     @default(1)
//   price           Decimal @db.Decimal(12, 2)
//   cogs            Decimal @db.Decimal(12, 2)
//   totalPrice      Decimal @db.Decimal(12, 2) @map("total_price")
//   totalCogs      Decimal @db.Decimal(12, 2) @map("total_cogs")

//   cart            Cart      @relation(fields: [cartId], references: [id], onDelete: Cascade)

//   @@map("cart_items")
// }

// model CartFile {
//   id        String   @id @default(cuid())
//   cartId    String   @db.VarChar(100)
//   fileUrl   String   @db.VarChar(255)
//   fileName  String   @db.VarChar(100)

//   cart      Cart     @relation(fields: [cartId], references: [id], onDelete: Cascade)

//   @@map("cart_files")
// }

// // Transaction and Payment
// model Transaction {
//   id          String        @id @default(cuid())
//   cartId      String        @db.VarChar(100) @unique
//   email      String?        @db.VarChar(100) @unique
//   totalAmount Decimal       @db.Decimal(12, 2) @map("total_amount")
//   status      TRANSACTION_ORDER  @default(PENDING)
//   createdAt   DateTime      @default(now()) @map("created_at") @db.Timestamp(0)
//   updatedAt   DateTime      @updatedAt @map("updated_at") @db.Timestamp(0)

//   cart        Cart          @relation(fields: [cartId], references: [id])
//   user        User?          @relation(fields: [email], references: [id], onDelete: Cascade)
//   payments    Payment?
//   delivery Delivery?

//   @@map("transactions")
// }

// model Payment {
//   id            String   @id @default(cuid())
//   transactionId String   @db.VarChar(100) @unique
//   amount        Decimal  @db.Decimal(12, 2)
//   method        String   @db.VarChar(100)
//   status        PAYMENT_STATUS  @default(PENDING)
//   createdAt   DateTime      @default(now()) @map("created_at") @db.Timestamp(0)
//   updatedAt   DateTime      @updatedAt @map("updated_at") @db.Timestamp(0)

//   transaction   Transaction @relation(fields: [transactionId], references: [id], onDelete: Cascade)

//   @@map("payments")
// }

// model Delivery {
//   id Int @id @default(autoincrement())
//   transactionId String @unique
//   courier String  @db.VarChar(100)
//   price   Decimal @db.Decimal(12, 2)
//   resi    String? @db.VarChar(100)

//   transaction Transaction @relation(fields: [transactionId], references: [id], onDelete: Cascade)
// }

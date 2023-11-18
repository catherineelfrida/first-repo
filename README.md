```
npm install prisma nodemon --save-dev
```

```
npx prisma init
```

```
npx prisma migrate dev --name init
```

```
npx prisma migrate dev --name updateProfile
```

```
npx prisma migrate dev --name updateBankAccount
```

### untuk update perubahan tabel di prisma
```
npx prisma migrate dev 
```

### untuk reset struktur database via prisma
```
npx prisma migrate reset
```
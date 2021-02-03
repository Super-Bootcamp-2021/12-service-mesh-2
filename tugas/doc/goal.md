# Goal

## Worker
POST /worker

Format yang disimpan kedalam db kv
``` JSON
    {
        "nama": "Budi",
        "alamat": "Jakarta",
        "email": "budi@mail.com",
        "no-telp": "081999888777",
        "biografi": "Pencinta kucing 🐱",
        "photo" : "localhost:9999/photo/6512673298.png",
        "deleted": false,
    }
```

GET /worker

Payload
``` JSON
    [{
        "nama": "Budi",
        "alamat": "Jakarta",
        "email": "budi@mail.com",
        "no-telp": "081999888777",
        "biografi": "Pencinta kucing 🐱",
        "photo" : "localhost:9999/photo/6512673298.png",
        "deleted": false,
    },
    {
        "nama": "Ani",
        "alamat": "Bangund",
        "email": "a333@mail.com",
        "no-telp": "081999222777",
        "biografi": "Suka bertani 👩‍🌾",
        "photo" : "localhost:9999/photo/896778699.png",
        "deleted": false,
    }]
```


## Task
POST /task

Format yang disimpan kedalam db kv
``` JSON
    {
        "task": "Beli nasi",
        "worker": "Budi",
        "attachment" : "localhost:9999/photo/attch-989089080.txt",
        "finish" : false,
        "delete" :false,
    }
```

GET /worker

Payload
``` JSON
    [{
        "task": "Beli nasi",
        "worker": "Budi",
        "attachment" : "localhost:9999/attachment/attch-989089080.txt",
        "finish" : false,
        "delete" :false,
    },
    {
        "task": "Cuci baju",
        "worker": "Ani",
        "attachment" : "localhost:9999/attachment/attch-785678678.txt",
        "finish" : false,
        "delete" :false,
    }]
```

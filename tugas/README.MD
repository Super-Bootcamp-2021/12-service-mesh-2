# Tugas

buat system manajemen task yang terdiri dari 2 web service

1. workers service
    menyediakan informasi mengenai pekerja 
    - menyimpan profil pekerja, nama, alamat, email, no-telp, biografi singkat#annas
    - upload foto pekerja#hadi
    - membaca profil pekerja#annas
    - menghapus informasi pekerja#annas

1. tasks service
    mengatur daftar pekerjaan
    - membuat pekerjaan baru, informasinya. pekerjaannya apa, pekerjanya siapa#silvi
    - bisa mengupload attachment untuk detail pekerjaan#mas hadi
    - menandakan pekerjaan sebagai selesai#silvi
    - membatalkan pekerjaan#silvi

spesifikasi
- informasi disimpan didalam key value storage dengan encoding JSON
- file disimpan di dalam filesystem


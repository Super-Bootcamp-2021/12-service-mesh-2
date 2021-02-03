# Tugas

buat system manajemen task yang terdiri dari 2 web service

1. workers service
    menyediakan informasi mengenai pekerja
    - menyimpan profil pekerja, nama, alamat, email, no-telp, biografi singkat
    - upload foto pekerja
    - membaca profil pekerja
    - menghapus informasi pekerja

1. tasks service
    mengatur daftar pekerjaan
    - membuat pekerjaan baru, informasinya. pekerjaannya apa, pekerjanya siapa
    - bisa mengupload attachment untuk detail pekerjaan
    - menandakan pekerjaan sebagai selesai
    - membatalkan pekerjaan

spesifikasi
- informasi disimpan didalam key value storage dengan encoding JSON
- file disimpan di dalam filesystem

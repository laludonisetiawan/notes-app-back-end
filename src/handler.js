// eslint-disable-next-line no-unused-vars
const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload;

  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNote = {
    title, tags, body, id, createdAt, updatedAt,
  };

  // memasukan nilai newNote ke dalam array notes menggunakan method push()
  notes.push(newNote);
  // jangan lupa impor array notes pada berkas handler.js
  /* menentukan apakah newNote sudah masuk ke dalam array notes menggunakan method filter() */
  const isSucces = notes.filter((note) => note.id === id).length > 0;

  if (isSucces) {
    const response = h.response({
      status: 'success',
      message: 'catatan berhasil ditambahkan',
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'catatan gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

const getNoteByIdHandler = (request, h) => {
  // eslint-disable-next-line max-len
  /* Di dalam fungsi ini kita harus mengembalikan objek catatan secara spesifik berdasarkan id yang digunakan oleh path parameter. Pertama, kita dapatkan dulu nilai id dari request.params. */
  const { id } = request.params;

  // eslint-disable-next-line max-len
  /* Setelah mendapatkan nilai id, dapatkan objek note dengan id tersebut dari objek array notes. Manfaatkan method array filter() untuk mendapatkan objeknya. */

  const note = notes.filter((n) => n.id === id)[0];

  // eslint-disable-next-line max-len
  /* Kita kembalikan fungsi handler dengan data beserta objek note di dalamnya. Namun sebelum itu, pastikan dulu objek note tidak bernilai undefined. Bila undefined, kembalikan dengan respons gagal. */
  if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'catatan tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editNoteByIdHandler = (request, h) => {
  // eslint-disable-next-line max-len
  /* Catatan yang diubah akan diterapkan sesuai dengan id yang digunakan pada route parameter. Jadi, kita perlu mendapatkan nilai id-nya terlebih dahulu. */
  const { id } = request.params;

  // eslint-disable-next-line max-len
  /* Setelah itu, kita dapatkan data notes terbaru yang dikirimkan oleh client melalui body request. */
  const { title, tags, body } = request.payload;

  // eslint-disable-next-line max-len
  /* Selain itu, tentu kita perlu perbarui juga nilai dari properti updatedAt. Jadi, dapatkan nilai terbaru dengan menggunakan new Date().toISOString(). */
  const updatedAt = new Date().toISOString();

  // eslint-disable-next-line max-len
  /* Great! Data terbaru sudah siap, saatnya mengubah catatan lama dengan data terbaru. Kita akan mengubahnya dengan memanfaatkan indexing array, silakan gunakan teknik lain bila menurut Anda lebih baik yah.Pertama, dapatkan dulu index array pada objek catatan sesuai id yang ditentukan. Untuk melakukannya, gunakanlah method array findIndex(). */
  const index = notes.findIndex((note) => note.id === id);
  // eslint-disable-next-line max-len
  /* Bila note dengan id yang dicari ditemukan, maka index akan bernilai array index dari objek catatan yang dicari. Namun bila tidak ditemukan, maka index bernilai -1. Jadi, kita bisa menentukan gagal atau tidaknya permintaan dari nilai index menggunakan if else. */
  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'catatan berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'gagal memperbarui catatan. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const index = notes.findIndex((note) => note.id === id);
  // eslint-disable-next-line max-len
  /* Lakukan pengecekan terhadap nilai index, pastikan nilainya tidak -1 bila hendak menghapus catatan. Nah, untuk menghapus data pada array berdasarkan index, gunakan method array splice(). */
  if (index !== -1) {
    notes.splice(index, 1);
    const response = h.response({
      status: 'succes',
      message: 'catatan berhasil di hapus',
    });
    response.code(200);
    return response;
  }
  /* Bila index bernilai -1, maka kembalikan handler dengan respons gagal. */
  const response = h.response({
    status: 'fail',
    message: 'catatan gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};

// file handler functions

const {nanoid} = require('nanoid');
const notes = require('./notes');

const noteExists = (id) =>{
  return notes.findIndex((note) => note.id === id);
};

const errorMessage = (action, h) => {
  const response = h.response({
    status: `fail`,
    message: `${action}. Data tidak ditemukan.`,
  });
  response.code = 404;
  return response;
};

const successMessage = (id, action, h) => {
  const response = h.response({
    status: `success`,
    message: `${action}`,
    data: {
      noteId: id,
    },
  });
  response.code = 200;
  return response;
};

const addNoteHandler = (req, h) => {
  const {title, tags, body} = req.payload;
  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;
  const newNote = {
    title, tags, body, id, createdAt, updatedAt,
  };
  notes.push(newNote);
  const isSuccess = notes.filter((note) => note.id === id).length > 0;
  if (isSuccess) {
    return successMessage(id, `Catatan berhasil dimasukkan`, h);
  }
};

const getAllNotesHandler = () => ({
  status: `success`,
  data: {
    notes,
  },
});

const getNoteByIdHandler = (req, h) => {
  const {id} = req.params;
  const note = notes.filter((n) => n.id === id)[0];
  if (note !== undefined) {
    return {
      status: `success`,
      data: {note},
    };
  }
  return errorMessage(`Tidak dapat membuka catatan`, h);
};

const editNoteHandler = (req, h) =>{
  const {id} = req.params;
  const {title, tags, body} = req.payload;
  const updatedAt = new Date().toISOString();
  const index = noteExists(id);
  if (index != -1) {
    notes[index] = {...notes[index], title, tags, body, updatedAt};
    return successMessage(id, `Catatan berhasil diperbarui`, h);
  }
  return errorMessage(`Tidak dapat memperbarui catatan`, h);
};

const deleteNoteHandler = (req, h) => {
  const {id} = req.params;
  const index = noteExists(id);
  if (index != -1) {
    notes.splice(index, 1);
    return successMessage(id, `Catatan berhasil dihapus`, h);
  }
  return errorMessage(`Tidak dapat menghapus catatan`, h);
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteHandler,
  deleteNoteHandler};

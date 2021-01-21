class Mime {
  constructor() {
    this.extensions = new Map();
    this.unknown = 'UNKNOWN';
  }

  addMimeTypeDefinition(extension, type) {
    this.extensions.set(extension.toLowerCase(), type);
  }

  getMimeType(fileName) {
    if (!fileName.includes('.')) {
      return this.unknown;
    }

    const extension = this.getExtension(fileName);

    return this.extensions.has(extension) ? this.extensions.get(extension) : this.unknown;
  }

  getExtension(fileName) {
    return fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
  }
}

const mime = new Mime();
const N = parseInt(readline()); // Number of elements which make up the association table.
const Q = parseInt(readline()); // Number Q of file names to be analyzed.
for (let i = 0; i < N; i++) {
  var inputs = readline().split(' ');
  const EXT = inputs[0]; // file extension
  const MT = inputs[1]; // MIME type.
  mime.addMimeTypeDefinition(EXT, MT);
}
for (let i = 0; i < Q; i++) {
  console.log(mime.getMimeType(readline()));
}
